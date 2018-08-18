"""
Smart Contract based Assets review on NEO blockchain
Created by Lukasz Schabek
lukasz.schabek@gmail.com

ToDo:
- avg of last rating into the Storage
- tokens list into the Storage (basci CRUD)
"""

from boa.interop.Neo.Runtime import CheckWitness, Log, Serialize, Deserialize
from boa.interop.Neo.Storage import GetContext, Put, Delete, Get
from boa.interop.Neo.Blockchain import GetHeight, GetBlock
from boa.builtins import concat

### Storage Key for storing Review.
def getReviewKey(address, script_hash):
    return concat("review.neo.review.", concat(address, script_hash))

### Storage Key for storing the Number of Reviews of a Script Hash.
def getNumberKey(script_hash):
    return concat("review.neo.number.", script_hash)

### Storage Key for storing Sequence Key for a Review.
def getScriptKey(script_hash, index):
    return concat("review.neo.script.", concat(script_hash, index))

### From: https://github.com/WorkinsCrowd/smart-contract/blob/master/smart-contracts/rsp.py#L15
def int_to_str(num):
    if num == 0:
        return '0'
    digits = []
    while num > 0:
        digits.append(num % 10)
        num /= 10
    digits.reverse()
    result = ''
    for digit in digits:
        result = concat(result, digit + 48)
    return result

### Main Section

def Main(operation, args):
    """
    Main definition for the smart contract

    :param operation: the operation to be performed
    :type operation: str

    :param args: list of arguments.
        args[0] is always address
        args[1] is always script_hash
    :param type: str

    :return:
        byterarray: The result of the operation
    """

    context = GetContext()
    # block = GetBlock(GetHeight())

    address = args[0]
    script_hash = args[1]

    numberKey = getNumberKey(script_hash)

    if operation != None:
        if operation == 'Test':
            return numberKey
        if operation == 'Ping':
            return 'Pong'
        if operation == 'addReview':
            reviewKey = getReviewKey(address, script_hash)
            reviewVal = Get(context, reviewKey)
            if not reviewVal:
                review = {
                    'address': address,
                    'script_hash': script_hash,
                    'rating': args[2],
                    'comment': args[3],
                    # 'timestamp': block.value.time
                }
                Put(context, reviewKey, Serialize(review))
                numberOfReviews = Get(context, numberKey)
                if not numberOfReviews:
                    Put(context, numberKey, 1)
                    Put(context, getScriptKey(script_hash, "1"), reviewKey)
                else:
                    # Update number of reviews for current Script Hash.
                    Put(context, numberKey, numberOfReviews + 1)
                    # Add Review reference stored as sequence key.
                    Put(context, getScriptKey(script_hash, int_to_str(numberOfReviews + 1)), reviewKey)
                return True
            else:
                return False
        if operation == 'getReview':
            reviewKey = getReviewKey(address, script_hash)
            reviewVal = Get(context, reviewKey)
            if not reviewVal:
                return False
            else:
                return reviewVal
        if operation == 'deleteReview':
            reviewKey = getReviewKey(address, script_hash)
            deleteVal = Delete(context, reviewKey)
            if not deleteVal:
                return False
            else:
                return True
        if operation == 'getNumberOfReviews':
            numberVal = Get(context, numberKey)
            if not numberVal:
                return '0'
            else:
                return int_to_str(numberVal)
        if operation == 'getReviewForScriptHash':
            scriptKey = getScriptKey(script_hash, int_to_str(args[2]))
            reviewKey = Get(context, scriptKey)
            if not reviewKey:
                return False
            else:
                reviewVal = Get(context, reviewKey)
                if not reviewVal:
                    return False
                else:
                    return reviewVal
    else:
        return False
