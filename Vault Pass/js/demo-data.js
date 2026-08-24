/**
 * VaultPass - Realistic Demo Vault Data
 * 
 * Pre-populated data demonstrating all 4 entry types, folders, tags,
 * TOTP tokens, passwords of various strengths, and audit test cases.
 */

const VaultDemoData = (() => {
  'use strict';

  const folders = [
    { id: 'f_personal', name: 'Personal', icon: 'user', createdAt: 1704067200000 },
    { id: 'f_work', name: 'Work & Cloud', icon: 'briefcase', createdAt: 1704067200000 },
    { id: 'f_finance', name: 'Finance & Banking', icon: 'credit-card', createdAt: 1704067200000 },
    { id: 'f_social', name: 'Social & Media', icon: 'globe', createdAt: 1704067200000 },
    { id: 'f_developer', name: 'Developer', icon: 'terminal', createdAt: 1704067200000 }
  ];

  const entries = [
    {
      id: 'e_github',
      type: 'login',
      title: 'GitHub',
      website: 'https://github.com',
      username: 'alex.mercer@gmail.com',
      password: 'kR9$mQ#8vL2!xP5@zW4*uT7&',
      totpSecret: 'JBSWY3DPEHPK3PXP', // Base32 test secret
      folderId: 'f_developer',
      tags: ['dev', '2fa', 'git', 'auth'],
      isFavorite: true,
      notes: 'Primary developer account. Hardware security key (YubiKey 5C) is also enrolled as backup 2FA.',
      createdAt: 1705320000000,
      updatedAt: 1718100000000,
      passwordHistory: [
        { password: 'vM4!pL9#kQ2$rT8@', date: '2023-11-12' }
      ]
    },
    {
      id: 'e_aws',
      type: 'login',
      title: 'AWS Management Console',
      website: 'https://console.aws.amazon.com',
      username: 'alex.mercer@cloudcorp.io',
      password: 'H8#vF7!zN3$wK9@qP5*rT2&y',
      totpSecret: 'HXDMVJECJJWSRB3H',
      folderId: 'f_work',
      tags: ['work', 'cloud', 'aws', 'infra'],
      isFavorite: true,
      notes: 'IAM Account ID: 984210492811\nRole: DevOpsAdmin\nRegion: us-east-1 (N. Virginia)',
      createdAt: 1706180000000,
      updatedAt: 1719200000000,
      passwordHistory: []
    },
    {
      id: 'e_proton',
      type: 'login',
      title: 'Proton Mail & Drive',
      website: 'https://mail.proton.me',
      username: 'mercer.vault@proton.me',
      password: 'Citadel-Emerald-Whisper-72',
      totpSecret: '',
      folderId: 'f_personal',
      tags: ['email', 'privacy', 'encrypted'],
      isFavorite: true,
      notes: 'End-to-end encrypted email address for financial and privacy notifications.',
      createdAt: 1707000000000,
      updatedAt: 1720000000000,
      passwordHistory: []
    },
    {
      id: 'e_chase',
      type: 'login',
      title: 'Chase Online Banking',
      website: 'https://www.chase.com',
      username: 'amercer_invest',
      password: 'K9#mQ8$vL2!xP5@z',
      totpSecret: '',
      folderId: 'f_finance',
      tags: ['finance', 'banking', 'checking'],
      isFavorite: true,
      notes: 'Primary checking and brokerage account. Phone verification enabled.',
      createdAt: 1708000000000,
      updatedAt: 1721000000000,
      passwordHistory: []
    },
    {
      id: 'e_stripe',
      type: 'login',
      title: 'Stripe Merchant Dashboard',
      website: 'https://dashboard.stripe.com',
      username: 'alex@startupdev.co',
      password: 'S9!mP4#kR8$vL3@qT7*uN2&w',
      totpSecret: 'KRSXG5CTMVRXEZLU',
      folderId: 'f_work',
      tags: ['work', 'billing', 'payments'],
      isFavorite: false,
      notes: 'Production API live keys stored in VaultPass secure notes.',
      createdAt: 1709000000000,
      updatedAt: 1722000000000,
      passwordHistory: []
    },
    {
      id: 'e_netflix',
      type: 'login',
      title: 'Netflix',
      website: 'https://www.netflix.com',
      username: 'family.mercer@gmail.com',
      password: 'M4ple-Syrup-Breeze-2024',
      totpSecret: '',
      folderId: 'f_social',
      tags: ['streaming', 'family', 'media'],
      isFavorite: false,
      notes: '4K Ultra HD Family Plan.',
      createdAt: 1710000000000,
      updatedAt: 1723000000000,
      passwordHistory: []
    },
    {
      id: 'e_openai',
      type: 'login',
      title: 'OpenAI Developer Platform',
      website: 'https://platform.openai.com',
      username: 'alex.mercer@gmail.com',
      password: 'P8$vK3#mQ7!xN2@wR5*uL9&z',
      totpSecret: '',
      folderId: 'f_developer',
      tags: ['ai', 'api', 'dev'],
      isFavorite: false,
      notes: 'Organization: Mercer Labs\nAPI Tier: Usage Tier 4',
      createdAt: 1711000000000,
      updatedAt: 1723500000000,
      passwordHistory: []
    },
    {
      id: 'e_weak_demo',
      type: 'login',
      title: 'Legacy Retro Boards Forum',
      website: 'https://retroboards.net',
      username: 'alex_gamer99',
      password: 'password123', // Demonstrates weak password detection in security audit
      totpSecret: '',
      folderId: 'f_social',
      tags: ['gaming', 'legacy'],
      isFavorite: false,
      notes: 'Old account created in 2018. Highlighted by VaultPass audit as weak and insecure.',
      createdAt: 1702000000000,
      updatedAt: 1702000000000,
      passwordHistory: []
    },
    {
      id: 'e_reused_demo',
      type: 'login',
      title: 'Old Discount Hub',
      website: 'https://discountshop.example.com',
      username: 'alex.mercer@gmail.com',
      password: 'K9#mQ8$vL2!xP5@z', // Reused password matching Chase to showcase audit alert
      totpSecret: '',
      folderId: 'f_personal',
      tags: ['shopping'],
      isFavorite: false,
      notes: 'Demonstrates password reuse detection in VaultPass Security Audit report.',
      createdAt: 1703000000000,
      updatedAt: 1703000000000,
      passwordHistory: []
    },

    // --- SECURE NOTES ---
    {
      id: 'e_ssh_key',
      type: 'note',
      title: 'Production Infrastructure SSH Key',
      content: `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBAv89vY3...[DEMO ENCRYPTED KEY DATA]...
-----END OPENSSH PRIVATE KEY-----

Bastion Host IP: 198.51.100.42 (Port 2222)
Key Passphrase: See VaultPass entry "Bastion Passphrase"
Authorized Users: alex.mercer, ops-root`,
      folderId: 'f_developer',
      tags: ['ssh', 'keys', 'server', 'devops'],
      isFavorite: true,
      notes: '',
      createdAt: 1705000000000,
      updatedAt: 1720000000000
    },
    {
      id: 'e_crypto_seed',
      type: 'note',
      title: 'Cold Storage Hardware Wallet Seed',
      content: `BIP-39 Recovery Mnemonic (12 Words):
1. crystal   2. harbor    3. canyon    4. falcon
5. ember     6. quartz    7. horizon   8. meadow
9. prism     10. nexus    11. orbit    12. whisper

Derivation Path: m/44'/60'/0'/0 (Ethereum / Bitcoin)
Hardware Device: Ledger Nano X (Firmware 2.2.3)
Keep strictly offline. Do not photograph or enter into unencrypted software.`,
      folderId: 'f_finance',
      tags: ['crypto', 'bitcoin', 'hardware-wallet', 'seed'],
      isFavorite: true,
      notes: '',
      createdAt: 1706000000000,
      updatedAt: 1721500000000
    },
    {
      id: 'e_home_wifi',
      type: 'note',
      title: 'Home Office Wi-Fi & Network Topology',
      content: `Primary SSID: ApexNet-5G (WPA3 Enterprise)
Pre-Shared Key: Alpine-Glacier-Summit-99#
Guest SSID: ApexNet-Guest (Isolated VLAN 30)
Guest Key: WelcomeToApex2024!

Router Admin Gateway: https://192.168.1.1:8443
Admin User: sysadmin_mercer
Admin Pass: R8#mP3!kQ9$vL4@w`,
      folderId: 'f_personal',
      tags: ['wifi', 'network', 'home'],
      isFavorite: false,
      notes: '',
      createdAt: 1707500000000,
      updatedAt: 1719500000000
    },

    // --- CREDIT CARDS ---
    {
      id: 'e_card_corp',
      type: 'card',
      title: 'Company Corporate Sapphire',
      cardholderName: 'Alexander Mercer',
      cardNumber: '4532819238471092',
      brand: 'Visa',
      expMonth: '09',
      expYear: '28',
      cvv: '742',
      pin: '8391',
      billingAddress: '100 Montgomery St, Suite 1400, San Francisco, CA 94104',
      folderId: 'f_work',
      tags: ['corp', 'expenses', 'work'],
      isFavorite: true,
      notes: 'Monthly corporate spending limit: $15,000. Use for cloud hosting and SaaS tooling only.',
      createdAt: 1708500000000,
      updatedAt: 1722800000000
    },
    {
      id: 'e_card_personal',
      type: 'card',
      title: 'Personal World Elite Mastercard',
      cardholderName: 'Alexander J Mercer',
      cardNumber: '5412752190834410',
      brand: 'Mastercard',
      expMonth: '04',
      expYear: '27',
      cvv: '319',
      pin: '4208',
      billingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
      folderId: 'f_finance',
      tags: ['personal', 'rewards', 'cashback'],
      isFavorite: false,
      notes: '2% cashback on all travel and dining.',
      createdAt: 1709500000000,
      updatedAt: 1723100000000
    },

    // --- IDENTITIES ---
    {
      id: 'e_id_alex',
      type: 'identity',
      title: 'Alexander Mercer (Personal)',
      firstName: 'Alexander',
      middleName: 'James',
      lastName: 'Mercer',
      titleHonorific: 'Mr.',
      email: 'alex.mercer@gmail.com',
      phone: '+1 (555) 234-8901',
      ssn: '482-91-8492',
      passportNumber: 'A19482751',
      addressStreet: '742 Evergreen Terrace',
      addressCity: 'Springfield',
      addressState: 'OR',
      addressZip: '97477',
      addressCountry: 'United States',
      company: 'Nexus Logic Solutions LLC',
      jobTitle: 'Principal Security Architect',
      folderId: 'f_personal',
      tags: ['identity', 'passport', 'primary'],
      isFavorite: true,
      notes: 'Passport valid through Nov 2031. Driver license renewed Aug 2024.',
      createdAt: 1704500000000,
      updatedAt: 1723400000000
    }
  ];

  return {
    folders,
    entries
  };
})();
