(declare-datatypes (T1 T2) ((Pair (mk-pair (first T1) (second T2)))))
(declare-datatypes (T) ((Lst nil (cons (hd T) (tl Lst)))))
(declare-datatypes () ((Op0Type C0 C1 VAR)))


; small example to test chaining / listing formulas
; has only 1 unary and 1 binary funcs
; 

(define-fun plu1((x Int)) Int          (+  x 1))
(define-fun mul2((x Int)(x Int)) Int    (*  x y))

(define-fun synth_op0 ((x Op0Type)(v Int)) Int
  (if (= x VAR)
   v
   (if (= x C0)
		 0
		 1))
)

(define-fun chain_plu1 ((x Int) (ch (Lst (Op0Type))) ) Int
	(plu1 
		(if (= nil ch)
			x
			(chain_plu1 x (tl ch))
		)
	)
)

(define-fun lambdalist ((x Int) (ch (Lst (Op0Type))) ) Int
)

(declare-const chain (Lst Op0Type))

(define-fun lambda_hole ((x Int)) Int
  (chain_plu1 x chain)
)

(assert (= (lambda_hole 1) 2))

(check-sat)
(get-model)
