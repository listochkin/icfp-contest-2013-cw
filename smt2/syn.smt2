; a buggy attempt on synthesis

(define-sort Val () (_ BitVec 64))

(declare-datatypes () ((Op1Type NOT SHL1 SHR1 SHR4 SHR16)))
(declare-datatypes () ((Op2Type AND OR XOR PLUS)))
(declare-datatypes () ((Op0Type C0 C1 VAR)))
(declare-datatypes () ((Op0TypeFold C0F C1F V1 V2 V3)))

(declare-datatypes (T1 T2) ((Pair (mk-pair (first T1) (second T2)))))
;(declare-datatypes (T) ((Lst nil (cons (hd T) (tl Lst)))))

; operators

(define-fun z_not
    ((x Val)) Val
    (bvnot x)
)

(define-fun z_shl1
    ((x Val)) Val
    (bvshl x (_ bv1 64))
)

(define-fun z_shr1
    ((x Val)) Val
    (bvlshr x (_ bv1 64))
)

(define-fun z_shr4
    ((x Val)) Val
    (bvlshr x (_ bv4 64))
)

(define-fun z_shr16
    ((x Val)) Val
    (bvlshr x (_ bv16 64))
)

; op2's for variables
(define-fun z_and
  ((x Val) (y Val)) Val
   (bvand x y)
)

(define-fun z_or
  ((x Val) (y Val)) Val
   (bvor x y)
)

(define-fun z_xor
  ((x Val) (y Val)) Val
   (bvxor x y)
)

(define-fun z_plus
  ((x Val) (y Val)) Val
   (bvadd x y)
)

(define-fun z_if0 ((e Val) (a Val) (b Val)) Val
	(if (= e (_ bv0 64)) a b)
)

(define-fun z_fold_i ((x Val) (i Val)) Val
  (bvand (bvlshr x i) (_ bv255 64))
)

(define-fun z_fold_op ((a Val) (b Val)) Val

;IMPLEMENT
(_ bv0 64)
)

(define-fun z_fold
   ((x Val)
    (y Val)
; cant' declare functional type
; redefeine z_fold_op function to call lambda
;    (z_fold_op ((Val Val) Val)
    ) Val
   (z_fold_op (z_fold_i x (_ bv56 64))
   (z_fold_op (z_fold_i x (_ bv48 64))
   (z_fold_op (z_fold_i x (_ bv40 64))
   (z_fold_op (z_fold_i x (_ bv32 64))
   (z_fold_op (z_fold_i x (_ bv24 64))
   (z_fold_op (z_fold_i x (_ bv16 64))
   (z_fold_op (z_fold_i x (_ bv8 64))
   (z_fold_op (z_fold_i x (_ bv0 64)) y))))))))
)

; synth functions

(define-fun synth_op0 ((x Op0Type)(v Val)) Val
    (if (= x VAR)
	v
	(if (= x C0)
		(_ bv0 64)
		(_ bv1 64))))

(define-fun synth_op0_fold ((x Op0TypeFold)(v Val)(v2 Val)(v3 Val)) Val
    (if (= x V1)
	v
	(if (= x V2)
	    v2
	    (if (= x V3)
		v3
		(if (= x C0F)
		    (_ bv0 64)
		    (_ bv1 64))))))


(define-fun synth_op1 ((h Op1Type)(v Val)) Val
    (if (= h NOT)
        (z_not v)
        (if (= h SHL1)
        	(z_shl1 v)
        	(if (= h SHR1)
        		(z_shr1 v)
        		(if (= h SHR4)
	        		(z_shr4 v)
	        		(z_shr16 v))))))

(define-fun synth_op2 ((h Op2Type)(v1 Val)(v2 Val)) Val
    (if (= h AND)
        (z_and v1 v2)
        (if (= h OR)
        	(z_or v1 v2)
        	(if (= h XOR)
        		(z_xor v1 v2)
        		(z_plus v1 v2)))))

;(declare-const op1 Op1Type)
;(declare-const op2 Op2Type)
;(declare-const c1 Op0Type)

;(define-fun hole_v((v Val)) Val
;	(synth_op1 op1 v))

;(define-fun hole_c((v Op0Type)) Val
;	(synth_op1 op1 (synth_op0 c1)))

(declare-const chain (List (Pair Op1Type Op0Type)))

(define-fun lambda_hole ((x Val)) Val
  (synth_op1 (first (head chain)) (synth_op0 (second (head chain)) x))
)

(assert (not (= chain nil)))

;(assert (= (lambda_hole #x0000000001345345) #xFFFFFFFFFECBACBA))
;(assert (= (lambda_hole #x0000000001345345) #x0000000000000000))
(assert (= (lambda_hole (_ bv2 64)) #xFFFFFFFFFFFFFFFD))
;(assert (= (lambda_hole (_ bv1 64)) #x0000000000000002))
;(assert (= (lambda_hole #x0000000001345345) #xFFFFFFFFFFFFFFFF))
;(assert (= (lambda_hole #x0000000001345345) #xFFFFFFFFFFFFFFFE))

(simplify (z_shr16 #x0000000001345345))

(check-sat)
(get-model)

