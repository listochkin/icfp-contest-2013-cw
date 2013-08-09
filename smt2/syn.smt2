; a buggy attempt on synthesis

(declare-datatypes () ((Op1Type NOT SHL1 SHR1 SHR4 SHR16)))
(declare-datatypes () ((Op2Type AND OR XOR PLUS)))
(declare-datatypes () ((ConstType C0 C1)))

; op1's for variable
(define-fun z_not_v
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvsub (bvneg x) (_ bv1 64))
)

(define-fun z_shl1_v
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvshl x (_ bv1 64))
)

(define-fun z_shr1_v
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvlshr x (_ bv1 64))
)

(define-fun z_shr4_v
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvlshr x (_ bv4 64))
)

(define-fun z_shr16_v
    ((x (_ BitVec 64))) (_ BitVec 64)
    (bvlshr x (_ bv16 64))
)


; op1's for const
(define-fun z_not_c
  ((x ConstType)) (_ BitVec 64)
    (if (= x C0)
	(bvsub (bvneg (_ bv0 64)) (_ bv1 64))
	(bvsub (bvneg (_ bv1 64)) (_ bv1 64)))
)

(define-fun z_shl1_c
  ((x ConstType)) (_ BitVec 64)
    (if (= x C0)
	(bvshl (_ bv0 64) (_ bv1 64))
	(bvshl (_ bv1 64) (_ bv1 64)))
)

(define-fun z_shr1_c
    ((x ConstType)) (_ BitVec 64)
    (if (= x C0)
	(bvlshr (_ bv0 64) (_ bv1 64))
	(bvlshr (_ bv1 64) (_ bv1 64)))
)

(define-fun z_shr4_c
    ((x ConstType)) (_ BitVec 64)
    (if (= x C0)
	(bvlshr (_ bv0 64) (_ bv4 64))
        (bvlshr (_ bv0 64) (_ bv4 64)))
)

(define-fun z_shr16_c
    ((x ConstType)) (_ BitVec 64)
    (if (= x C0)
	(bvlshr (_ bv0 64) (_ bv16 64))
	(bvlshr (_ bv0 64) (_ bv16 64)))
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
)(declare-const op1 Op1Type)
(declare-const op2 Op2Type)
(declare-const c1 ConstType)

(define-fun synth_op1_v ((h Op1Type)(v (_ BitVec 64))) (_ BitVec 64)
    (if (= h NOT)
        (z_not_v v)
        (if (= h SHL1)
        	(z_shl1_v v)
        	(if (= h SHR1)
        		(z_shr1_v v)
        		(if (= h SHR4)
	        		(z_shr4_v v)
	        		(z_shr16_v v))))))

(define-fun synth_op1_c ((h Op1Type)(v ConstType)) (_ BitVec 64)
    (if (= h NOT)
        (z_not_c v)
        (if (= h SHL1)
        	(z_shl1_c v)
        	(if (= h SHR1)
        		(z_shr1_c v)
        		(if (= h SHR4)
	        		(z_shr4_c v)
	        		(z_shr16_c v))))))


(define-fun hole_v((v (_ BitVec 64))) (_ BitVec 64)
	(synth_op1_v op1 v))

(define-fun hole_c((v ConstType)) (_ BitVec 64)
	(synth_op1_c op1 c1))

(define-fun lambda_hole ((x (_ BitVec 64))) (_ BitVec 64)
   (hole_c x)
)

(assert (= (lambda_hole #x0000000001345345) #x0000000000000000))
;(assert (= (lambda_hole (_ bv2 64)) #xFFFFFFFFFFFFFFFD))
;(assert (= (lambda_hole (_ bv1 64)) #x0000000000000002))

(simplify (z_shr16_v #x0000000001345345))

(check-sat)
(get-model)

