; a buggy attempt on synthesis

(define-sort Val () (_ BitVec 64))

(declare-datatypes () ((Op1Type NOT SHL1 SHR1 SHR4 SHR16)))
(declare-datatypes () ((Op2Type AND OR XOR PLUS)))
(declare-datatypes () ((Op0Type C0 C1 VAR)))
(declare-datatypes () ((Op0TypeFold C0F C1F V1 V2 V3)))

;(declare-datatypes (T1 T2) ((Pair (mk-pair (first T1) (second T2)))))
;(declare-datatypes (T1 T1 T2 T3 T5) ((Tuple (mk-tuple (optype T1) (op00 T2) (op01 T3)(op1 T4)(op2 T5)))))
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
    (ite (= e (_ bv0 64)) a b)
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

; unary test
;(declare-const o_01 Op1Type)
;(declare-const o_02 Op1Type)
;(declare-const o_03 Op1Type)
;(declare-const o_04 Op1Type)
;(declare-const o_05 Op1Type)
;(declare-const v_05 Op0Type)
;(define-fun lambda ((x Val)) Val
;  (synth_op1 o_01 (synth_op1 o_02 (synth_op1 o_03 (synth_op1 o_04 (synth_op1 o_05 (synth_op0 v_05 x))))))
;)
;(assert (= (lambda #x0000000071345345) #x0000000000000E26))
;(check-sat)
;(get-model)

; binary unary mixed test with 2 iterations
;(declare-const o_01 Op2Type)
;(declare-const v1_01 Op0Type)
;(declare-const v2_01 Op0Type)
;(declare-const o_02 Op1Type)
;(declare-const o_03 Op2Type)
;(declare-const v1_03 Op0Type)
;(define-fun lambda ((x Val)) Val
;    (synth_op2 o_03 (synth_op0 v1_03 x) (synth_op1 o_02 (synth_op2 o_01 (synth_op0 v1_01 x) (synth_op0 v2_01 x)))))  
;(assert (= (lambda (_ bv3 64)) #x000000000000000B))
;(check-sat)
;(get-model)
;(assert (= (lambda #x0000000000567567) #x0000000000FA9FB7))
;(check-sat)
;(get-model)


; bonus problem
(define-fun lambda_orig ((x Val)) Val
    (z_if0
	(z_and (z_xor x (z_shr1 (z_shl1 (z_not (z_shl1 x))))) (_ bv1 64))
	(z_and (z_shl1 x) (z_shr16 x)) (z_or (z_not (z_shl1 (_ bv1 64))) x)))
(simplify (lambda_orig #x0000000000567567))

(declare-const o_01 Op2Type)
(declare-const o_02 Op2Type)
(declare-const o_03 Op1Type)
(declare-const o_04 Op1Type)
(declare-const o_05 Op1Type)
(declare-const o_06 Op1Type)
(declare-const o_07 Op2Type)
(declare-const o_08 Op1Type)
(declare-const o_09 Op1Type)
(declare-const o_10 Op2Type)
(declare-const o_11 Op1Type)
(declare-const o_12 Op1Type)

(declare-const v_01 Op0Type)
(declare-const v_02 Op0Type)
(declare-const v_03 Op0Type)
(declare-const v_04 Op0Type)
(declare-const v_05 Op0Type)
(declare-const v_06 Op0Type)
(declare-const v_07 Op0Type)


(define-fun lambda ((x Val)) Val
    (z_if0
        (synth_op2 o_01 (synth_op2 o_02 (synth_op0 v_01 x) (synth_op1 o_03 (synth_op1 o_04 (synth_op1 o_05 (synth_op1 o_06 (synth_op0 v_02 x)))))) (synth_op0 v_03 x))
        (synth_op2 o_07 (synth_op1 o_08 (synth_op0 v_04 x)) (synth_op1 o_09 (synth_op0 v_05 x))) (synth_op2 o_10 (synth_op1 o_11 (synth_op1 o_12 (synth_op0 v_06 x))) (synth_op0 v_07 x))))

(assert (= (lambda #x0000000000567567) #x0000000000000046))
(assert (= (lambda #x0000000445645345) #x0000000000000400))
(assert (= (lambda #x0000000000000000) #xFFFFFFFFFFFFFFFD))
(assert (= (lambda #x00000005FFFFFFFF) #x000000000005FFFE))
(assert (= (lambda #x0054675467456745) #x0000000046004600))

(check-sat)
(get-model)