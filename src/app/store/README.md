# NgRX Stores

In order to move most state management out of a large number of components we have utilised a more
functionally reactive event driven "flux" pattern that uses a centralised store.  The pattern is used in more and more
client applications but is actually an implementation of Event Sourcing.  I will explain some of the ideas behind this and a little about
our implemenation here but there is a lot of information available about this pattern online.

## Generalized idea

Most of the applications container components subscribe to a number of stores and populate their view based upon the next state received.
State manipulation is done indirectly through dispatching commands to stores.  This method more neatly separates these side effects.


## Effects services

In order to change and query store update a direct reference to the store is needed.  Using this reference commands and queries (returning rxjs observables)
can be made.  These can be made from anywhere in the application but in order to encapsulate and keep things more DRY we have
utilised 'effects' services which are used to dispatch commands and make queries against store state.

## Reducers

Current state for a store is the accumulation of the effects of each command which is dispatched to a store - a fold left of all
events.  A reducer takes an individual event and current store state then produces the next store state as an ouput.  Each state of the
store should be immutable therefore reducers should be referentially transparent - one input always maps to the same output.  This
also ensures that testing the logic should be straightforward and the functions are easy to reason about.

Because for most data the manipulation required is mostly the same - a lot of the reducers just use a default reducer which just does some basic
state updates.  This can then be extended if more specific change is needed.
