using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using Neo.SmartContract.Framework.Services.System;
using System;
using System.ComponentModel;
using System.Numerics;

public class ScriptHashReview : SmartContract
{
	//https://peterlinx.github.io/DataTransformationTools/

	//testinvoke cdf4cdad9a6c201b5501125e4c87e02b65a363f2 addReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '55526d13aa05b8c6f69b31028e11618351a68175', '5', 'Very good']
	//testinvoke 37143884a7ddc4018abe1497e9f7c0147a59a87a getReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', 'bddc990a8f560ac78ca2645bc19e08de536f89c9']
	//testinvoke 55526d13aa05b8c6f69b31028e11618351a68175 getReviewKey ['#\xba\'\x03\xc52c\xe8\xd6\xe5"\xdc2 39\xdc\xd8\xee\xe955526d13aa05b8c6f69b31028e11618351a68175']
	//testinvoke cdf4cdad9a6c201b5501125e4c87e02b65a363f2 getReviewFrom ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '1']
	public static readonly byte[] contractOwnerAddress = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y".ToScriptHash();

    // Utilities
	private static StorageContext Context() => Storage.CurrentContext;

 
	// Keys
	private static byte[] ReviewKey(byte[] address, byte[] scriptHash) => address.Concat(scriptHash);
 
	private static byte[] NumberOfReviewsFromAddressKey(byte[] address) => ("NBREVIEWSFROM".AsByteArray()).Concat(address);
	private static byte[] NumberOfReviewsForScriptHashKey(byte[] scriptHash) => ("NBREVIEWSFOR".AsByteArray()).Concat(scriptHash);

	private static byte[] ReviewFromAddressKey(byte[] address, byte[] count) => ("REVIEWFROM".AsByteArray()).Concat(address).Concat(count); ////value = ReviewKey(address, scriptHash)
	private static byte[] ReviewForScriptHashKey(byte[] scriptHash, byte[] count) => ("REVIEWFOR".AsByteArray()).Concat(scriptHash).Concat(count); //value = ReviewKey(address, scriptHash)


	public static Object Main(string operation, params object[] args)
    {
		if (Runtime.Trigger == TriggerType.Verification)
		{
			// param Owner must be script hash
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
				review.note = (BigInteger)args[2];
				review.text = (String)args[3];

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
                review.note = (BigInteger)args[2];
                review.text = (String)args[3];

                return EditReview(review);
            }
			if (operation == "deleteReview")
			{
				
			}        
			if (operation == "getNumberOfReviewsFrom")
			{
				
			}
			if (operation == "getNumberOfReviewsFor")
			{
				
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
			if (operation == "test")
			{
				return "JeanMichelAullas";
			}
		}

		return false;      
    }

	public static bool AddReview(Review review)
	{
		if (!Runtime.CheckWitness(review.reviewOwner)) { return false; }

		if (Storage.Get(Context(), ReviewKey(review.reviewOwner, review.scriptHash)).Length > 0) 
		{

			Runtime.Log("This address has already posted a review for this scripthash");
			return false; 
		}

        //Check if the review already exists. If yes, return false because we don't want to add the review to the lists?

		if (!IsReviewOK(review)) { return false; }

		byte[] reviewKey = ReviewKey(review.reviewOwner, review.scriptHash);
		Runtime.Notify("-- Review key --");
        Runtime.Notify(reviewKey.AsString());
		byte[] serializedReview = Neo.SmartContract.Framework.Helper.Serialize(review);

		Storage.Put(Context(), reviewKey, serializedReview);

		//Increment the number of reviews from the address
		byte[] currentNumberOfReviewsFromAddress = Storage.Get(Context(), NumberOfReviewsFromAddressKey(review.reviewOwner));
		byte[] newNumberOfReviewsFromAddress = (currentNumberOfReviewsFromAddress.AsBigInteger() + 1).AsByteArray();

		Storage.Put(Context(), NumberOfReviewsFromAddressKey(review.reviewOwner), newNumberOfReviewsFromAddress);

        //Increment the number of review for the scripthash
		byte[] currentNumberOfReviewsForScriptHash = Storage.Get(Context(), NumberOfReviewsForScriptHashKey(review.scriptHash));
		byte[] newNumberOfReviewsForScriptHash = (currentNumberOfReviewsForScriptHash.AsBigInteger() + 1).AsByteArray();

		Storage.Put(Context(), NumberOfReviewsForScriptHashKey(review.scriptHash), newNumberOfReviewsForScriptHash);

		//Add the corresponding ReviewKey 
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

		//Check if the review exists. If no, return false because we don't want to create a review here.
		if (Storage.Get(Context(), ReviewKey(review.reviewOwner, review.scriptHash)).Length < 1) { return false; }

		if (!IsReviewOK(review)) { return false; }
        
        
        byte[] key = ReviewKey(review.reviewOwner, review.scriptHash);
        byte[] serializedReview = Neo.SmartContract.Framework.Helper.Serialize(review);

        Storage.Put(Context(), key, serializedReview);

        return true;
	}

	public static bool DeleteReview(byte[] address, byte[] scriptHash)
	{
		//Check phatansma contract RemoveMessage
		if (!Runtime.CheckWitness(address)) { return false; }

		byte[] key = ReviewKey(address, scriptHash);

        //Check if the review exists before deleting it?

        //Also delete from list of review for script hash and list of review from address

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

	public static bool IsReviewOK(Review review)
	{
		//Check if the scripthash exists or is a good value, check the length
		if (review.note < 0 || review.note > 10) { return false; }      
        if (review.text.Length <= 0) { return false; }
        
		return true;
	}

	[Serializable]
	public class Review
	{
		public byte[] reviewOwner;
		public byte[] scriptHash;
		public BigInteger note;
		public String text;	
	}
}