; a buggy attempt on synthesis

(declare-datatypes () ((Op1Type NOT SHL1 SHR1 SHR4 SHR16)))
(declare-datatypes () ((Op2Type AND OR XOR PLUS)))
(declare-datatypes () ((ConstType C_0 C_1)))

(define-fun z_not
  ((x (_ BitVec 64))) (_ BitVec 64)
   (bvsub (bvneg x) (_ bv1 64))
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

(define-fun z_and
  ((x (_ BitVec 64)) (y (_ BitVec 64))) (_ BitVec 64)
   (bvand x y)
)

(define-fun z_if0 ((e (_ BitVec 64)) (a (_ BitVec 64)) (b (_ BitVec 64))) (_ BitVec 64)
	(if (= e (_ bv0 64)) a b)
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


(declare-const op1 Op1Type)
(declare-const op2 Op2Type)

(define-fun synth-op1 ((h Op1Type)(v (_ BitVec 64))) (_ BitVec 64)
    (if (= h NOT)
        (z_not v)
        (if (= h SHL1)
        	(z_shl1 v)
        	(if (= h SHR1)
        		(z_shr1 v)
        		(if (= h SHR4)
	        		(z_shr4 v)
	        		(z_shr16 v))))))

(define-fun hole((v (_ BitVec 64))) (_ BitVec 64)
	(synth-op1 op1 v))

(define-fun lambda_hole ((x (_ BitVec 64))) (_ BitVec 64)
   (hole x)
)

(assert (= (lambda_hole #x0000000001345345) #x0000000000000134))
;(assert (= (lambda_hole (_ bv2 64)) #xFFFFFFFFFFFFFFFD))
;(assert (= (lambda_hole (_ bv1 64)) #x0000000000000002))

(simplify (z_shr16 #x0000000001345345))

(check-sat)
(get-model)

