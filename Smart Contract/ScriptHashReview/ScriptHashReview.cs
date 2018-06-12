using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using Neo.SmartContract.Framework.Services.System;
using System;
using System.ComponentModel;
using System.Numerics;

public class ScriptHashReview : SmartContract
{
	//https://peterlinx.github.io/DataTransformationTools/

	// testinvoke 88d4743e3c7936b4b7811ad980e414e114374f35 addReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '7f86d61ff377f1b12e589a5907152b57e2ad9a7a', '9', 'Very good']
	// testinvoke 88d4743e3c7936b4b7811ad980e414e114374f35 getReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '7f86d61ff377f1b12e589a5907152b57e2ad9a7a']
	// testinvoke 88d4743e3c7936b4b7811ad980e414e114374f35 editReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '7f86d61ff377f1b12e589a5907152b57e2ad9a7a', '1', 'Not really good']
	// testinvoke 88d4743e3c7936b4b7811ad980e414e114374f35 getNumberOfReviewsFor ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a']
	// testinvoke 88d4743e3c7936b4b7811ad980e414e114374f35 getReviewForScriptHash ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a', '1']
    
	// testinvoke 88d4743e3c7936b4b7811ad980e414e114374f35 addToken ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a', 'ACAT Token', 'ACAT', '6250000000', 'QmTrjRYLwdFSG66sRMMRc5eVkrjwLXRnMfGBssKWoSoSVg']
	// testinvoke 6faccce567a901b72d30a832fd126efd07061bb5 editToken ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a', 'ACAT Token edit', 'ACAT edit', '7250000000', 'QmTrjRYLwdFSG66sRMMRc5eVkrjwLXRnMfGBssKWoSoSVg']
	// testinvoke 6faccce567a901b72d30a832fd126efd07061bb5 deleteToken ['2']
	// testinvoke 6faccce567a901b72d30a832fd126efd07061bb5 getToken ['CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC']
	// testinvoke 6faccce567a901b72d30a832fd126efd07061bb5 getNumberOfTokens []
	// testinvoke 6faccce567a901b72d30a832fd126efd07061bb5 getTokenFromIndex ['1']


    // Contract owner key   
	public static readonly byte[] contractOwnerAddress = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y".ToScriptHash();

    // Utilities
	private static StorageContext Context() => Storage.CurrentContext;

 
	// Review Keys
	private static byte[] ReviewKey(byte[] address, byte[] scriptHash) => address.Concat(scriptHash);
 
	private static byte[] NumberOfReviewsFromAddressKey(byte[] address) => ("NBREVIEWSFROM".AsByteArray()).Concat(address);
	private static byte[] NumberOfReviewsForScriptHashKey(byte[] scriptHash) => ("NBREVIEWSFOR".AsByteArray()).Concat(scriptHash);

	private static byte[] ReviewFromAddressKey(byte[] address, byte[] count) => ("REVIEWFROM".AsByteArray()).Concat(address).Concat(count);         //value = ReviewKey(address, scriptHash)
	private static byte[] ReviewForScriptHashKey(byte[] scriptHash, byte[] count) => ("REVIEWFOR".AsByteArray()).Concat(scriptHash).Concat(count);  //value = ReviewKey(address, scriptHash)

    // Token Keys
	private static byte[] TokenKey(byte[] scriptHash) => ("TOKEN".AsByteArray()).Concat(scriptHash);
  
	private static byte[] NumberOfTokensKey() => "NBTOKENS".AsByteArray();

	private static byte[] TokenIndexKey(byte[] index) => ("TOKENINDEX".AsByteArray()).Concat(index);


	public static Object Main(string operation, params object[] args)
    {
		if (Runtime.Trigger == TriggerType.Verification)
		{
			bool isOwner = Runtime.CheckWitness(contractOwnerAddress);

			if (isOwner) { return true; }
			else { return false; }
		}
		else if (Runtime.Trigger == TriggerType.Application)
		{
			if (operation == "addReview")
			{
				if (args.Length != 4) { return false; }

				Review review = new Review();

				review.reviewOwner = (byte[])args[0];
				review.scriptHash = (byte[])args[1];
				review.rating = (BigInteger)args[2];
				review.comment = (String)args[3];

				return AddReview(review);
			}
			if (operation == "getReview")
			{
				if (args.Length != 2) { return false; }

				byte[] address = (byte[])args[0];
				byte[] scriptHash = (byte[])args[1];

				return GetReview(address, scriptHash);
			}
			if (operation == "editReview")
			{
				if (args.Length != 4) { return false; }

				Review review = new Review();

				review.reviewOwner = (byte[])args[0];
				review.scriptHash = (byte[])args[1];
				review.rating = (BigInteger)args[2];
				review.comment = (String)args[3];

				return EditReview(review);
			}
			if (operation == "deleteReview")
			{
				if (args.Length != 2) { return false; }

				byte[] reviewOwner = (byte[])args[0];
				BigInteger index = (BigInteger)args[1];

				return DeleteReview(reviewOwner, index);
			}
			if (operation == "getNumberOfReviewsFor")
			{
				if (args.Length != 1) { return false; }

				byte[] scriptHash = (byte[])args[0];

				return GetNumberOfReviewsFor(scriptHash);
			}
			if (operation == "getReviewForScriptHash")
			{
				if (args.Length != 2) { return false; }

				byte[] scriptHash = (byte[])args[0];
				byte[] number = (byte[])args[1];

				return GetReviewForScriptHash(scriptHash, number);
			}

			//Admin part for the tokens
			if (!Runtime.CheckWitness(contractOwnerAddress)) { return false; }

			if (operation == "addToken")
			{
				if (args.Length != 5) { return false; }

				Token token = new Token();

				token.scriptHash = (byte[])args[0];
				token.name = (String)args[1];
				token.symbol = (String)args[2];
				token.supply = (BigInteger)args[3];
				token.IPFSHash = (String)args[4];

				return AddToken(token);
			}
			if (operation == "editToken")
			{
				if (args.Length != 5) { return false; }

				Token newToken = new Token();

				newToken.scriptHash = (byte[])args[0];
				newToken.name = (String)args[1];
				newToken.symbol = (String)args[2];
				newToken.supply = (BigInteger)args[3];
				newToken.IPFSHash = (String)args[4];

				return EditToken(newToken);
			}
			if (operation == "deleteToken")
			{
				if (args.Length != 1) { return false; }

				BigInteger index = (BigInteger)args[0];

				return DeleteToken(index);
			}
			if (operation == "getToken")
			{
				if (args.Length != 1) { return false; }

				byte[] scriptHash = (byte[])args[0];

				return GetToken(scriptHash);
			}
   			if (operation == "getNumberOfTokens")
			{
				return GetNumberOfTokens();
			}
			if (operation == "getTokenFromIndex")
			{
				if (args.Length != 1) { return false; }

				BigInteger index = (BigInteger)args[0];

				return GetTokenFromIndex(index);
			}
		}
		return false;      
    }

    // Review

	public static bool AddReview(Review review)
	{
		if (!Runtime.CheckWitness(review.reviewOwner)) { return false; }

		// An address can only post 1 review per scriptHash
		if (Storage.Get(Context(), ReviewKey(review.reviewOwner, review.scriptHash)).Length > 0) 
		{
			Runtime.Log("This address has already posted a review for this scripthash");
			return false; 
		}
      
        // Check if a token with this scripthash exists. You can only post reviews for existing tokens
		byte[] tokenKey = TokenKey(review.scriptHash);
		byte[] serializedToken = Storage.Get(Context(), tokenKey);

        // Check if there is a token with this script hash in the storage
        if (serializedToken.Length < 1)
        {
            Runtime.Log("You can't add a review for a script hash not associated to a token.");
            return false;
        }

        // Check if the review is correct
		if (!IsReviewOK(review)) { return false; }

        // Store the review
		byte[] reviewKey = ReviewKey(review.reviewOwner, review.scriptHash);
		byte[] serializedReview = Neo.SmartContract.Framework.Helper.Serialize(review);

		Storage.Put(Context(), reviewKey, serializedReview);
      
        // Increment the number of review for the scriptHash
		byte[] currentNumberOfReviewsForScriptHash = Storage.Get(Context(), NumberOfReviewsForScriptHashKey(review.scriptHash));
		byte[] newNumberOfReviewsForScriptHash = (currentNumberOfReviewsForScriptHash.AsBigInteger() + 1).AsByteArray();

		Storage.Put(Context(), NumberOfReviewsForScriptHashKey(review.scriptHash), newNumberOfReviewsForScriptHash);
		Storage.Put(Context(), ReviewForScriptHashKey(review.scriptHash, newNumberOfReviewsForScriptHash), reviewKey);

		return true;
	}
    
	public static object GetReview(byte[] address, byte[] scriptHash)
	{
		byte[] key = ReviewKey(address, scriptHash);
		byte[] serializedReview = Storage.Get(Context(), key);

		if (Storage.Get(Context(), key).Length < 1) { return false; }

		Review review = (Review)Neo.SmartContract.Framework.Helper.Deserialize(serializedReview);
      
		return review;
	}

	public static bool EditReview(Review review)
	{
		if (!Runtime.CheckWitness(review.reviewOwner)) { return false; }
        
		// Check if the review exists. If no, return false because we don't want to create a review here.
		byte[] previousSerializedReview = Storage.Get(Context(), ReviewKey(review.reviewOwner, review.scriptHash));
		if (previousSerializedReview.Length < 1) { return false; }
        
		// Check if the caller address is the same as review owner's address
		Review previousDeserializedReview = (Review)Neo.SmartContract.Framework.Helper.Deserialize(previousSerializedReview);

		if (previousDeserializedReview.reviewOwner != review.reviewOwner)
		{
			Runtime.Notify("You can only edit your reviews.");
			return false;
		}

        // You can only change the rating and the comment of the review
		if (previousDeserializedReview.reviewOwner != review.reviewOwner || previousDeserializedReview.scriptHash != review.scriptHash)
		{
			Runtime.Notify("You can only edit the rating and the comment of the review.");
            return false;
		}

		if (!IsReviewOK(review)) { return false; }
        
        byte[] key = ReviewKey(review.reviewOwner, review.scriptHash);
        byte[] serializedReview = Neo.SmartContract.Framework.Helper.Serialize(review);

        Storage.Put(Context(), key, serializedReview);

        return true;
	}
    
	public static bool DeleteReview(byte[] reviewOwner, BigInteger index)
	{
		if (!Runtime.CheckWitness(reviewOwner) || !Runtime.CheckWitness(contractOwnerAddress)) { return false; }

		//byte[] key = ReviewKey(address, scriptHash);

        // Check if the review exists before deleting it?

        // Also delete from list of review for script hash and list of review from address

		//Storage.Delete(Context(), key);

		return true;
	}

	public static object GetReviewForScriptHash(byte[] scriptHash, byte[] number)
    {
		byte[] key = ReviewForScriptHashKey(scriptHash, number);
        byte[] reviewKey = Storage.Get(Context(), key);

        if (reviewKey.Length < 1) { return false; }

        byte[] serializedReview = Storage.Get(Context(), reviewKey);

        if (serializedReview.Length < 1) { return false; }

        Review review = (Review)Neo.SmartContract.Framework.Helper.Deserialize(serializedReview);

        return review;
    }

	public static BigInteger GetNumberOfReviewsFor(byte[] scriptHash)
    {
		byte[] key = NumberOfReviewsForScriptHashKey(scriptHash);
		byte[] numberOfReviewsForScriptHashKey = Storage.Get(Context(), key);

		if (numberOfReviewsForScriptHashKey.Length < 1) { return 0; }

		return numberOfReviewsForScriptHashKey.AsBigInteger();
    }

	public static bool IsReviewOK(Review review)
	{
		// Check if the scripthash exists or is a good value, check the length
		if (review.rating < 0 || review.rating > 10) { return false; }      
        if (review.comment.Length <= 0) { return false; }
        
		return true;
	}

    // Token

	public static bool AddToken(Token token)
	{
        // Check if there is already a token with this script hash in the storage
		byte[] tokenKey = TokenKey(token.scriptHash);
        byte[] checkToken = Storage.Get(Context(), tokenKey);

        // Check if there is a token with this script hash in the storage
		if (checkToken.Length > 1)
        {
            Runtime.Log("A token with this script hash already exists.");
            return false;
        }

        // Store the token
        byte[] serializedToken = Neo.SmartContract.Framework.Helper.Serialize(token);

        Storage.Put(Context(), tokenKey, serializedToken);


		// Increment the number of tokens
		BigInteger currentNumberOfTokens = GetNumberOfTokens();
		byte[] newNumberOfTokens = (currentNumberOfTokens + 1).AsByteArray();

		Storage.Put(Context(), NumberOfTokensKey(), newNumberOfTokens);

		// Add the token to the index
		byte[] tokenIndexKey = TokenIndexKey(newNumberOfTokens);
		Storage.Put(Context(), tokenIndexKey, tokenKey);
			
		return true;
	}

	public static bool EditToken(Token newToken)
    {
		byte[] tokenKey = TokenKey(newToken.scriptHash);
		byte[] previousSerializedToken = Storage.Get(Context(), tokenKey);

		if (previousSerializedToken.Length < 1) 
		{
			Runtime.Log("This token doesn't exist");
			return false; 
		}

        // Update the token
		byte[] serializedNewToken = Neo.SmartContract.Framework.Helper.Serialize(newToken);

		Storage.Put(Context(), tokenKey, serializedNewToken);
        
        return true;
    }

	public static bool DeleteToken(BigInteger index)
	{
		if (index <= 0) { return false; }

		// Get the number of tokens
		byte[] numberOfTokensKey = NumberOfTokensKey();
		byte[] numberOfTokens = Storage.Get(Context(), numberOfTokensKey);
              
		if (index > numberOfTokensKey.AsBigInteger()) { return false; }
              
		// Check if there is a token with this index in the storage
		byte[] tokenIndexKey = TokenIndexKey(index.AsByteArray());
		byte[] tokenIndex = Storage.Get(Context(), tokenIndexKey);
      
        if (tokenIndex.Length < 1) { return false; }

		// Copy the value of the last token
		byte[] lastTokenIndexKey = TokenIndexKey(numberOfTokens);
		byte[] lastToken = Storage.Get(Context(), lastTokenIndexKey);

		// Delete the token from the storage      
		Token tokenFromIndex = (Token)GetTokenFromIndex(index);
        byte[] tokenScriptHash = tokenFromIndex.scriptHash;

		Storage.Delete(Context(), TokenKey(tokenScriptHash));
		Storage.Delete(Context(), lastTokenIndexKey);

		// Decrement the number of tokens
        BigInteger currentNumberOfTokens = GetNumberOfTokens();
        byte[] newNumberOfTokens = (currentNumberOfTokens - 1).AsByteArray();
       
        Storage.Put(Context(), NumberOfTokensKey(), newNumberOfTokens);
              
		// Move last value to the removed index if we don't remove the last token in the index
		if (index != numberOfTokens.AsBigInteger())
		{
			Storage.Put(Context(), tokenIndexKey, lastToken);
		}
		      
		return true;
	}

	public static object GetToken(byte[] scriptHash)
	{
		byte[] key = TokenKey(scriptHash);
        byte[] serializedToken = Storage.Get(Context(), key);

        if (serializedToken.Length < 1) { return false; }

		Token token = (Token)Neo.SmartContract.Framework.Helper.Deserialize(serializedToken);

		return token;
	}

	public static object GetTokenFromIndex(BigInteger index)
	{
		byte[] key = TokenIndexKey(index.AsByteArray());
		byte[] tokenIndex = Storage.Get(Context(), key);

		if (tokenIndex.Length < 1) { return false; }

		byte[] serializedToken = Storage.Get(Context(), tokenIndex);

		if (serializedToken.Length < 1) { return false; }

		Token token = (Token)Neo.SmartContract.Framework.Helper.Deserialize(serializedToken);

		return token;
	}
        
	public static BigInteger GetNumberOfTokens()
	{
		byte[] key = NumberOfTokensKey();
		byte[] numberOfTokens = Storage.Get(Context(), key);

		return numberOfTokens.AsBigInteger();
	}

    // Serializable

	[Serializable]
	public class Review
	{
		public byte[] reviewOwner;
		public byte[] scriptHash;
		public BigInteger rating;
		public String comment;	
	}

	[Serializable]
    public class Token
    {
        public byte[] scriptHash;
		public String name;
		public String symbol;
        public BigInteger supply;
		public String IPFSHash;
    }
}