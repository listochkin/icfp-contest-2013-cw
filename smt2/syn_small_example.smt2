(declare-datatypes (T1 T2) ((Pair (mk-pair (first T1) (second T2)))))
(declare-datatypes (T1 T2 T3) ((Tpl3 (mk-tpl3 (tpl3_1 T1) (tpl3_2 T2) (tpl3_3 T3)))))
(declare-datatypes (T) ((Lst nil (cons (hd T) (tl Lst)))))

(declare-datatypes () ((Op1Type PLU1)))
(declare-datatypes () ((Op0Type C0 C1 VAR CALL_PLU1)))

; small example to test chaining / listing formulas
; has only 1 unary func
;
(define-fun plu1((x Int)) Int         (+  x 1))

(define-fun s_op0 ((x Op0Type)(v Int)) Int
  (if (= x CALL_PLU1)
	(plu1 v)
	(if (= x VAR)
		v
		(if (= x C0)
			0
			1))))

(define-fun s_op1 ((x Op0Type)(v Int)) Int
	(plu1 (s_op0 x v))
)

(define-fun mk_in ((in (Lst Op0Type))(op Op0Type)(x Int))
					(Pair (Lst Op0Type) Int)
	(mk-pair (cons op in)
		(s_op0 op x))
)

(define-fun next_chain ((in (Lst Op0Type))(op Op0Type)(x Int))
						(Pair (Lst Op0Type) Int)
	(if (= nil in)
		(mk_in nil VAR x)
		; chain calls
		(if (= CALL_PLU1 (hd in))
			(mk_in in CALL_PLU1 x)
		; unroll head
		(if (= VAR (hd in))
			(mk_in (tl in) C0 x)
		(if (= C0 (hd in))
			(mk_in (tl in) C1 x)
			(mk_in in CALL_PLU1 x)))))
)

(define-fun produce_chain
    ((p (Pair (Lst Op0Type) Int)))
      (Pair (Lst Op0Type) Int)
	 (next_chain (first p) VAR (second p))
)

(define-fun step_array
    ((i Int) (targetVal Int) (arr (Array Int (Pair (Lst Op0Type) Int))))
      (Array Int (Pair (Lst Op0Type) Int))

	(if (= targetVal (second (select arr i)))
		(store arr (+ i 1) (mk_in nil VAR targetVal))
		(store arr (+ i 1) (produce_chain (select arr i)))
	)

)

(declare-const x1 Int)
(declare-const ch (Lst Op0Type))

(assert (not (= nil ch)))
(assert (= x1 1))
(assert (= 2 (second (next_chain ch VAR x1)))
)

(define-fun zz ((i Int)) (Tpl3 Int Int Int)
  (mk-tpl3 i i i)
)

(display (zz 3))
(check-sat)
(get-model)