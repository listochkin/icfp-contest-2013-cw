; a buggy attempt on synthesis

(declare-datatypes () ((Op1Type NOT SHL1 SHR1 SHR4 SHR16)))
(declare-datatypes () ((Op2Type AND OR XOR PLUS)))
(declare-datatypes () ((Op0Type C0 C1 VAR)))

(declare-datatypes (T1 T2) ((Pair (mk-pair (first T1) (second T2)))))
(declare-datatypes (T) ((Lst nil (cons (hd T) (tl Lst)))))

; op1's for variable
(define-fun z_not
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvnot x)
)

(define-fun z_shl1
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvshl x (_ bv1 64))
)

(define-fun z_shr1
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvlshr x (_ bv1 64))
)

(define-fun z_shr4
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvlshr x (_ bv4 64))
)

(define-fun z_shr16
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvlshr x (_ bv16 64))
)

; op2's for variables
(define-fun z_and
  ((x (_ BitVec 64)) (y (_ BitVec 64))) (_ BitVec 64)
   (bvand x y)
)

(define-fun z_if0 ((e (_ BitVec 64)) (a (_ BitVec 64)) (b (_ BitVec 64))) (_ BitVec 64)
	(if (= e (_ bv0 64)) a b)
)
(define-fun z_or
  ((x (_ BitVec 64)) (y (_ BitVec 64))) (_ BitVec 64)
   (bvor x y)
)

(define-fun z_xor
  ((x (_ BitVec 64)) (y (_ BitVec 64))) (_ BitVec 64)
   (bvxor x y)
)

(define-fun z_plus
  ((x (_ BitVec 64)) (y (_ BitVec 64))) (_ BitVec 64)
   (bvadd x y)
)

(define-fun z_fold_i ((x (_ BitVec 64)) (i (_ BitVec 64))) (_ BitVec 64)
  (bvand (bvlshr x i) (_ bv255 64))
)

(define-fun z_fold_op ((a (_ BitVec 64)) (b (_ BitVec 64))) (_ BitVec 64)

;IMPLEMENT
(_ bv0 64)
)


(define-fun z_fold
   ((x (_ BitVec 64))
    (y (_ BitVec 64))
; cant' declare functional type
; redefeine z_fold_op function to call lambda
;    (z_fold_op (((_ BitVec 64) (_ BitVec 64)) (_ BitVec 64))
    ) (_ BitVec 64)
   (z_fold_op (z_fold_i x (_ bv56 64))
   (z_fold_op (z_fold_i x (_ bv48 64))
   (z_fold_op (z_fold_i x (_ bv40 64))
   (z_fold_op (z_fold_i x (_ bv32 64))
   (z_fold_op (z_fold_i x (_ bv24 64))
   (z_fold_op (z_fold_i x (_ bv16 64))
   (z_fold_op (z_fold_i x (_ bv8 64))
   (z_fold_op (z_fold_i x (_ bv0 64)) y))))))))
)
;(declare-const op1 Op1Type)
;(declare-const op2 Op2Type)
;(declare-const c1 Op0Type)


(define-fun synth_op1_v ((h Op1Type)(v (_ BitVec 64))) (_ BitVec 64)
    (if (= h NOT)
        (z_not v)
        (if (= h SHL1)
        	(z_shl1 v)
        	(if (= h SHR1)
        		(z_shr1 v)
        		(if (= h SHR4)
	        		(z_shr4 v)
	        		(z_shr16 v))))))

(define-fun synth_op0_c ((x Op0Type)(v (_ BitVec 64))) (_ BitVec 64)
    (if (= x VAR)
      v
    (if (= x C0)
		(_ bv0 64)
		(_ bv1 64))
	)
)

;(define-fun hole_v((v (_ BitVec 64))) (_ BitVec 64)
;	(synth_op1_v op1 v))

;(define-fun hole_c((v Op0Type)) (_ BitVec 64)
;	(synth_op1_v op1 (synth_op0_c c1)))

(declare-const chain (Lst (Pair Op1Type Op0Type)))


(define-fun lambda_hole ((x (_ BitVec 64))) (_ BitVec 64)
  (synth_op1_v (first (hd chain)) (synth_op0_c (second (hd chain)) x))
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

