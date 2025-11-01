export default async function handler(req, res) {
    console.log('FOUNDER server env =', process.env.FOUNDER_ADDRESS);
  
    res.status(200).json({
      founder_env_value: process.env.FOUNDER_ADDRESS || 'Not found'
    });
  }