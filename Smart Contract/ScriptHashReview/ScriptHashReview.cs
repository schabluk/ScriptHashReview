using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using Neo.SmartContract.Framework.Services.System;
using System;
using System.ComponentModel;
using System.Numerics;

public class ScriptHashReview : SmartContract
{
	//https://peterlinx.github.io/DataTransformationTools/

	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 addReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '55526d13aa05b8c6f69b31028e11618351a68175', '9', 'Very good']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 getReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '55526d13aa05b8c6f69b31028e11618351a68175']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 editReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '55526d13aa05b8c6f69b31028e11618351a68175', '1', 'Not really good']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 getNumberOfReviewsFrom ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 getNumberOfReviewsFor ['55526d13aa05b8c6f69b31028e11618351a68175']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 getReviewFromAddress ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '1']
    //
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 addToken ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a', 'ACAT Token', 'ACAT', '6250000000', 'QmTrjRYLwdFSG66sRMMRc5eVkrjwLXRnMfGBssKWoSoSVg']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 editToken ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a', 'ACAT Token edit', 'ACAT edit', '7250000000', 'QmTrjRYLwdFSG66sRMMRc5eVkrjwLXRnMfGBssKWoSoSVg']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 getToken ['7f86d61ff377f1b12e589a5907152b57e2ad9a7a']
	// testinvoke 4e0f097c104436ff49e8a9b6a770b8833f8429f3 getNumberOfTokens []


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
				
			}        
			if (operation == "getNumberOfReviewsFrom")
			{
				if (args.Length != 1) { return false; }

				byte[] address = (byte[])args[0];

				return GetNumberOfReviewsFrom(address);
			}
			if (operation == "getNumberOfReviewsFor")
			{
				if (args.Length != 1) { return false; }
                
                byte[] scriptHash = (byte[])args[0];

				return GetNumberOfReviewsFor(scriptHash);
			}
			if (operation == "getReviewFromAddress")
			{
				if (args.Length != 2) { return false; }

				byte[] address = (byte[])args[0];
				byte[] number = (byte[])args[1];

				return GetReviewFromAddress(address, number);
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
				//if (args.Length != 1) { return false; }

				//byte[] scriptHash = (byte[])args[0];

				//return DeleteToken(scriptHash);
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

		// Increment the number of reviews from the address
		byte[] currentNumberOfReviewsFromAddress = Storage.Get(Context(), NumberOfReviewsFromAddressKey(review.reviewOwner));
		byte[] newNumberOfReviewsFromAddress = (currentNumberOfReviewsFromAddress.AsBigInteger() + 1).AsByteArray();

		Storage.Put(Context(), NumberOfReviewsFromAddressKey(review.reviewOwner), newNumberOfReviewsFromAddress);

        // Increment the number of review for the scriptHash
		byte[] currentNumberOfReviewsForScriptHash = Storage.Get(Context(), NumberOfReviewsForScriptHashKey(review.scriptHash));
		byte[] newNumberOfReviewsForScriptHash = (currentNumberOfReviewsForScriptHash.AsBigInteger() + 1).AsByteArray();

		Storage.Put(Context(), NumberOfReviewsForScriptHashKey(review.scriptHash), newNumberOfReviewsForScriptHash);

		// Add the corresponding ReviewKey 
		Storage.Put(Context(), ReviewFromAddressKey(review.reviewOwner, newNumberOfReviewsFromAddress), reviewKey);
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

	public static bool DeleteReview(byte[] address, byte[] scriptHash)
	{
		// TODO
		if (!Runtime.CheckWitness(address)) { return false; }

		byte[] key = ReviewKey(address, scriptHash);

        // Check if the review exists before deleting it?

        // Also delete from list of review for script hash and list of review from address

		Storage.Delete(Context(), key);

		return true;
	}

	public static object GetReviewFromAddress(byte[] address, byte[] number)
    {
		byte[] key = ReviewFromAddressKey(address, number);      
        byte[] reviewKey = Storage.Get(Context(), key);
		       
		if (reviewKey.Length < 1) { return false; }
            
		byte[] serializedReview = Storage.Get(Context(), reviewKey);

		if (serializedReview.Length < 1) { return false; }

        Review review = (Review)Neo.SmartContract.Framework.Helper.Deserialize(serializedReview);

		return review;
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

	public static BigInteger GetNumberOfReviewsFrom(byte[] address)
	{
		byte[] key = NumberOfReviewsFromAddressKey(address);
        byte[] numberOfReviewsFromAddressKey = Storage.Get(Context(), key);

		if (numberOfReviewsFromAddressKey.Length < 1) { return 0; }

		return numberOfReviewsFromAddressKey.AsBigInteger();
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

		Storage.Put(Context(), NumberOfReviewsFromAddressKey(NumberOfTokensKey()), newNumberOfTokens);

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

	public static object GetToken(byte[] scriptHash)
	{
		byte[] key = TokenKey(scriptHash);
        byte[] serializedToken = Storage.Get(Context(), key);

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