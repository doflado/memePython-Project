import React, { useMemo } from 'react';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './index.module.scss';

import Button from '@/components/based/Button';
import WalletModal from '@/components/composed/wallet/WalletModal';
import {
  useUpdateWalletModal,
  useWalletModalOpened,
} from '@/state/solana/hooks';

const AccountIndicator = () => {
  const walletModalOpened = useWalletModalOpened();
  const updateWalletModal = useUpdateWalletModal();
  const { publicKey, wallet } = useWallet();

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + '..' + base58.slice(-4);
  }, [wallet, base58]);

  return (
    <>
      <WalletModal
        open={walletModalOpened}
        onClose={() => updateWalletModal(false)}
      />
      <Button
        className={styles.account}
        onClick={() => updateWalletModal(true)}
      >
        {content ? <AccountCircleSharpIcon /> : <LoginSharpIcon />}
        {content ?? 'Login'}
      </Button>
    </>
  );
};

export default AccountIndicator;
