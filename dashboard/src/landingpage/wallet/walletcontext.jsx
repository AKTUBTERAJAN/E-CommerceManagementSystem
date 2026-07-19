import {createContext,useContext,useEffect,useState} from "react";
import {getWallet,addMoneyAPI,deductMoneyAPI} from "../../api/wallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Wallet Load
  const loadWallet = async () => {
    try {
      const data = await getWallet();

      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  // Add Money
  const addMoney = async () => {
    const amount = Number(paymentAmount);

    if (amount <= 0) return;

    try {
      const data = await addMoneyAPI(amount);

      setBalance(data.balance);
      setTransactions(data.transactions);
      setPaymentAmount(0);
    } catch (err) {
      alert(err.message || "Unable to Add Money");
    }
  };

  // Deduct Money
  const deductMoney = async (amount) => {
    try {
      const data = await deductMoneyAPI(amount);

      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (err) {
      alert(err.message || "Insufficient Balance");
    }
  };

  // Refund
  const refundMoney = async (amount) => {
    try {
      const data = await addMoneyAPI(amount);

      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        setBalance,
        paymentAmount,
        setPaymentAmount,
        addMoney,
        deductMoney,
        refundMoney,
        transactions,
        loadWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);