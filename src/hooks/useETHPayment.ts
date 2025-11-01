// src/hooks/useETHPayment.ts
import { useCallback } from "react";
import { BigNumber, ethers } from "ethers";
// ✅ TypeScript: Add type declaration for JS module
// @ts-ignore - JS module without type definitions
import useEthersContract from "./useEthersContract";

// مقدار ثابت فرانت (اگر قرارداد fee public نداشت)
const FRONTEND_FEE_WEI = ethers.utils.parseEther("0.001"); // 0.001 ETH

function hasFn(contract: any, sig: string) {
  // بررسی وجود تابع در ABI
  return Boolean(contract?.interface?.functions?.[sig]);
}

export default function useETHPayment() {
  const { paymentContract } = useEthersContract();

  // 1) گرفتن مبلغ پرداخت با fallback
  const getRequiredFee = useCallback(async () => {
    if (!paymentContract) throw new Error("Payment contract not initialized");

    try {
      // چند نام رایج را امتحان می‌کنیم
      if (hasFn(paymentContract, "fee()")) {
        const v = await paymentContract.fee();
        return BigNumber.from(v);
      }
      if (hasFn(paymentContract, "price()")) {
        const v = await paymentContract.price();
        return BigNumber.from(v);
      }
      if (hasFn(paymentContract, "REGISTRATION_FEE()")) {
        const v = await paymentContract.REGISTRATION_FEE();
        return BigNumber.from(v);
      }

      console.log("[ContractFeeChecker] no public fee fn, using fallback");
      return FRONTEND_FEE_WEI;
    } catch (e) {
      console.warn("[ContractFeeChecker] read fee failed -> fallback", e);
      return FRONTEND_FEE_WEI;
    }
  }, [paymentContract]);

  // 2) ارسال تراکنش با estimateGas تا MetaMask اخطار کمتری بده
  const sendETHPayment = useCallback(async () => {
    if (!paymentContract) throw new Error("Payment contract not initialized");

    const value = await getRequiredFee();

    // گس را تخمین بزنیم و کمی بالاتر بدهیم تا “likely to fail” کمتر شود
    let overrides: any = { value };
    try {
      const gas = await paymentContract.estimateGas.register(overrides);
      overrides.gasLimit = gas.mul(12).div(10); // +20%
    } catch (e) {
      // اگر estimateGas هم خطا داد، بدونش ادامه می‌دهیم
      console.warn("estimateGas failed, sending without explicit gasLimit", e);
    }

    const tx = await paymentContract.register(overrides);
    return await tx.wait(); // یا اگر UI شما خودش wait می‌کند، فقط tx برگردان
  }, [paymentContract, getRequiredFee]);

  return { getRequiredFee, sendETHPayment };
}