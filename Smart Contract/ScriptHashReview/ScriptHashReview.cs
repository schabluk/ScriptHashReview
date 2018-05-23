using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using Neo.SmartContract.Framework.Services.System;
using System;
using System.ComponentModel;
using System.Numerics;

public class ScriptHashReview : SmartContract
{
	//https://peterlinx.github.io/DataTransformationTools/

	// testinvoke f6329adf3ad3f0028b2c9ea63a3247ab51710bed addReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '55526d13aa05b8c6f69b31028e11618351a68175', '5', 'Very good']
	// testinvoke f6329adf3ad3f0028b2c9ea63a3247ab51710bed getReview ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '55526d13aa05b8c6f69b31028e11618351a68175']   
	// testinvoke f6329adf3ad3f0028b2c9ea63a3247ab51710bed getNumberOfReviewsFrom ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y']
	// testinvoke f6329adf3ad3f0028b2c9ea63a3247ab51710bed getNumberOfReviewsFor ['55526d13aa05b8c6f69b31028e11618351a68175']
	// testinvoke f6329adf3ad3f0028b2c9ea63a3247ab51710bed getReviewFromAddress ['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', '1']

	public static readonly byte[] contractOwnerAddress = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y".ToScriptHash();

    // Utilities
	private static StorageContext Context() => Storage.CurrentContext;

 
	// Keys
	private static byte[] ReviewKey(byte[] address, byte[] scriptHash) => address.Concat(scriptHash);
 
	private static byte[] NumberOfReviewsFromAddressKey(byte[] address) => ("NBREVIEWSFROM".AsByteArray()).Concat(address);
	private static byte[] NumberOfReviewsForScriptHashKey(byte[] scriptHash) => ("NBREVIEWSFOR".AsByteArray()).Concat(scriptHash);

	private static byte[] ReviewFromAddressKey(byte[] address, byte[] count) => ("REVIEWFROM".AsByteArray()).Concat(address).Concat(count);         //value = ReviewKey(address, scriptHash)
	private static byte[] ReviewForScriptHashKey(byte[] scriptHash, byte[] count) => ("REVIEWFOR".AsByteArray()).Concat(scriptHash).Concat(count);  //value = ReviewKey(address, scriptHash)


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
		}

		return false;      
    }

	public static bool AddReview(Review review)
	{
		if (!Runtime.CheckWitness(review.reviewOwner)) { return false; }

		// An address can only post 1 review per scriptHash
		if (Storage.Get(Context(), ReviewKey(review.reviewOwner, review.scriptHash)).Length > 0) 
		{

			Runtime.Log("This address has already posted a review for this scripthash");
			return false; 
		}
      
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

	[Serializable]
	public class Review
	{
		public byte[] reviewOwner;
		public byte[] scriptHash;
		public BigInteger rating;
		public String comment;	
	}
}