from abci import (
        ABCIServer,
        BaseApplication,
        Result
        )

"""Tx types:
    - sendTokens( addr, amount )
    - createPoll( question, amount, end_block, min_answers(optional) )
    - vote( question, answer )

    query actions:
    - get balance
    - get questions
    - get question metadata + current answers
    """

class Tenderfeud(BaseApplication):
    """Docs?
    """

    def init_chain(self, v):
        """Set initial state on first run"""
        print('Chain initialized')

    def check_tx(self, tx):
        """ Validate the Tx before entry into the mempool """
        return Result.ok()

    def deliver_tx(self, tx):
        """ Mutate state if valid Tx """
        return Result.ok()

    def end_block(self, height):
        """Called at the end of processing. If this is a stateful application
        you can use the height from here to record the last_block_height"""
        return ResponseEndBlock()

    def query(self, reqQuery):
        """Return the last tx count"""
        return []

    def commit(self):
        """Return the current encode state value to tendermint"""
        return Result.ok()

if __name__ == '__main__':
    app = ABCIServer(app=Tenderfeud())
    app.run()
