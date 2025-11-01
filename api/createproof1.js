export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { transactionHash, userAddress, amount } = req.body;
      
      console.log('✅ Proof creation requested:', {
        transactionHash,
        userAddress,
        amount
      });
      
      return res.status(200).json({
        success: true,
        message: 'Proof created successfully',
        data: {
          proofId: `PROOF_${Date.now()}`,
          transactionHash,
          userAddress,
          amount,
          timestamp: new Date().toISOString(),
          status: 'confirmed'
        }
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }