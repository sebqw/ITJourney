// SC-300 revision cards (Microsoft Identity and Access Administrator)
// ---------------------------------------------------------------------------
// HOW TO ADD A CARD
// Copy the template below, paste it into the list, and fill it in.
//
//   {
//       id: 'short-unique-name',          // letters, numbers and dashes, never reused
//       topic: 'Governance',              // one of the topics below
//       q: 'The question',
//       a: 'The answer. Put `code` in backticks.\nA new line starts a new paragraph.',
//       lab: ''                            // optional: what you did in your dev tenant
//   },
//
// The `lab` field is for examples from your own Microsoft 365 dev tenant.
// When it's filled in, the card shows a "From my dev tenant" box under the answer.
// Never paste real client names, domains, tenant IDs or passwords here: this
// file is public on the website.
// ---------------------------------------------------------------------------

window.NOTES_DECK = {
    key: 'sc300',

    // The four skill areas of the exam
    topics: [
        'Users & identities',
        'Authentication & access',
        'Apps & workload identities',
        'Governance'
    ],

    cards: [

        // ----- Users & identities -----
        {
            id: 'role-user-admin',
            topic: 'Users & identities',
            q: 'Which built-in role lets someone create users and reset passwords for non-admins, without being a Global Administrator?',
            a: 'User Administrator. It follows least privilege: it can manage users and groups and reset passwords for non-admin users, but it can\'t change settings across the whole tenant.',
            lab: ''
        },
        {
            id: 'admin-units',
            topic: 'Users & identities',
            q: 'What is an administrative unit used for?',
            a: 'It\'s a container of users, groups or devices. You assign a role scoped to the unit, so an admin can only manage what\'s inside it. For example, a helpdesk that can reset passwords for one office only.',
            lab: ''
        },
        {
            id: 'dynamic-groups',
            topic: 'Users & identities',
            q: 'What is a dynamic membership group, and what licence does it need?',
            a: 'A group whose members are worked out by a rule on user or device attributes, such as `user.department -eq "Sales"`. Members can\'t be added or removed by hand. It needs Microsoft Entra ID P1.',
            lab: ''
        },
        {
            id: 'group-licensing',
            topic: 'Users & identities',
            q: 'A user in a licensed group hasn\'t received their licence. What\'s a common cause?',
            a: 'The user has no usage location set. Group-based licensing can only assign a licence once the usage location is known, because service availability depends on the country.',
            lab: ''
        },
        {
            id: 'b2b-guests',
            topic: 'Users & identities',
            q: 'How does a B2B collaboration guest sign in, and where do you control who can be invited?',
            a: 'A guest signs in with their own organisation\'s or personal identity, and appears in your directory with the user type Guest.\nYou control invitations in External collaboration settings, and trust with specific organisations in cross-tenant access settings.',
            lab: ''
        },
        {
            id: 'connect-vs-cloud-sync',
            topic: 'Users & identities',
            q: 'What\'s the difference between Microsoft Entra Connect Sync and Cloud Sync?',
            a: 'Connect Sync runs a full sync engine on an on-premises server. Cloud Sync uses lightweight agents on-premises while the configuration lives in the cloud, and it can sync from multiple disconnected forests.',
            lab: ''
        },
        {
            id: 'phs-pta-federation',
            topic: 'Users & identities',
            q: 'Compare password hash sync, pass-through authentication and federation.',
            a: 'Password hash sync (PHS): a hash of the password hash is synced, and sign-in happens in the cloud. It also allows leaked credential detection.\nPass-through authentication (PTA): the password is checked against on-premises Active Directory through agents.\nFederation: sign-in is handed to another system such as AD FS.',
            lab: ''
        },

        // ----- Authentication & access -----
        {
            id: 'auth-methods-policy',
            topic: 'Authentication & access',
            q: 'Where do you choose which sign-in and MFA methods users are allowed to use?',
            a: 'In the Authentication methods policy in Microsoft Entra. It replaces the older per-user MFA and self-service password reset method settings, so methods are managed in one place and can be targeted at groups.',
            lab: ''
        },
        {
            id: 'phishing-resistant',
            topic: 'Authentication & access',
            q: 'Which authentication methods are phishing-resistant?',
            a: 'FIDO2 security keys and passkeys, Windows Hello for Business, and certificate-based authentication. They\'re tied to the real sign-in page, so a fake page can\'t capture and replay them.',
            lab: ''
        },
        {
            id: 'tap',
            topic: 'Authentication & access',
            q: 'What is a Temporary Access Pass (TAP) and when would you use one?',
            a: 'A time-limited passcode an admin issues so a user can sign in and register strong methods. Use it to onboard passwordless methods, or to recover someone who has lost their MFA device, without switching MFA off.',
            lab: ''
        },
        {
            id: 'sspr-writeback',
            topic: 'Authentication & access',
            q: 'What does a hybrid organisation need so self-service password reset also changes the on-premises password?',
            a: 'Password writeback, enabled in Microsoft Entra Connect, plus Microsoft Entra ID P1 licences.',
            lab: ''
        },
        {
            id: 'ca-building-blocks',
            topic: 'Authentication & access',
            q: 'What are the parts of a Conditional Access policy?',
            a: 'Assignments decide when it applies: users, target resources and conditions such as location, device platform and risk.\nAccess controls decide what happens: grant (block, or require MFA, a compliant device and so on) and session controls.',
            lab: ''
        },
        {
            id: 'ca-report-only',
            topic: 'Authentication & access',
            q: 'How do you test a Conditional Access policy without locking people out?',
            a: 'Create it in report-only mode. The sign-in logs show what the policy would have done, without enforcing it. The What If tool also shows which policies would apply to a given sign-in.',
            lab: ''
        },
        {
            id: 'break-glass',
            topic: 'Authentication & access',
            q: 'What are emergency access ("break glass") accounts, and how should they be set up?',
            a: 'Cloud-only Global Administrator accounts kept for emergencies, such as a Conditional Access mistake that locks out every admin. Keep at least two, exclude one from Conditional Access policies, protect them with strong credentials, and alert on any sign-in.',
            lab: ''
        },
        {
            id: 'security-defaults',
            topic: 'Authentication & access',
            q: 'Can security defaults and Conditional Access be used together?',
            a: 'No. Security defaults are a free baseline that turns on MFA and blocks legacy authentication. To use Conditional Access policies you turn security defaults off.',
            lab: ''
        },
        {
            id: 'identity-protection',
            topic: 'Authentication & access',
            q: 'In Microsoft Entra ID Protection, what\'s the difference between user risk and sign-in risk?',
            a: 'Sign-in risk is the chance that a particular sign-in wasn\'t made by the account owner, for example from an anonymous IP address.\nUser risk is the chance the account itself is compromised, for example leaked credentials.\nRisk-based Conditional Access needs Microsoft Entra ID P2.',
            lab: ''
        },
        {
            id: 'password-protection',
            topic: 'Authentication & access',
            q: 'What does Microsoft Entra password protection do?',
            a: 'It blocks weak passwords using Microsoft\'s global banned password list plus your own custom banned list, and smart lockout slows down password-guessing attacks.',
            lab: ''
        },

        // ----- Apps & workload identities -----
        {
            id: 'app-reg-vs-enterprise',
            topic: 'Apps & workload identities',
            q: 'What\'s the difference between an app registration and an enterprise application?',
            a: 'An app registration is the application object: the definition of the app in its home tenant.\nAn enterprise application is the service principal: the app\'s identity inside a tenant, where you assign users, set up single sign-on and apply Conditional Access.',
            lab: ''
        },
        {
            id: 'managed-identities',
            topic: 'Apps & workload identities',
            q: 'What is a managed identity, and what are the two types?',
            a: 'An identity for an Azure resource that Microsoft manages, so there are no secrets or certificates to store or rotate.\nSystem-assigned: tied to one resource and deleted with it.\nUser-assigned: created on its own and shared across several resources.',
            lab: ''
        },
        {
            id: 'delegated-vs-app-permissions',
            topic: 'Apps & workload identities',
            q: 'Delegated permissions versus application permissions?',
            a: 'Delegated: the app acts on behalf of a signed-in user, limited to what that user can do.\nApplication: the app acts as itself with no user present, and always needs admin consent.',
            lab: ''
        },
        {
            id: 'admin-consent-workflow',
            topic: 'Apps & workload identities',
            q: 'How can users ask for an app they aren\'t allowed to consent to themselves?',
            a: 'Turn on the admin consent workflow. Users send a request with a reason, and the reviewers you choose approve or deny it.',
            lab: ''
        },
        {
            id: 'app-proxy',
            topic: 'Apps & workload identities',
            q: 'What does Microsoft Entra application proxy do?',
            a: 'It publishes on-premises web apps to remote users through a connector installed on-premises. The connector only makes outbound connections, so no inbound firewall ports are opened, and users sign in with Entra ID first.',
            lab: ''
        },

        // ----- Governance -----
        {
            id: 'pim',
            topic: 'Governance',
            q: 'What does Privileged Identity Management (PIM) change about admin roles?',
            a: 'Admins hold roles as eligible instead of permanently active. They activate a role just in time, for a limited period, and activation can require MFA, a reason or approval. It needs Microsoft Entra ID P2.',
            lab: ''
        },
        {
            id: 'access-reviews',
            topic: 'Governance',
            q: 'What is an access review?',
            a: 'A recurring check of who still needs access to a group, an app or a role. Reviewers (managers, owners or the users themselves) approve or deny, and results can be applied automatically so access that\'s no longer needed is removed.',
            lab: ''
        },
        {
            id: 'entitlement-management',
            topic: 'Governance',
            q: 'What is an access package in entitlement management?',
            a: 'A bundle of resources (groups, apps and SharePoint sites) with a policy for who can request it, who approves it and when it expires. Access packages live in catalogs and work for guests as well as employees.',
            lab: ''
        },
        {
            id: 'lifecycle-workflows',
            topic: 'Governance',
            q: 'What are lifecycle workflows used for?',
            a: 'Automating joiner, mover and leaver tasks from user attributes such as the hire date or leave date. Examples: issue a Temporary Access Pass before day one, or disable the account and remove licences when someone leaves. They need Microsoft Entra ID Governance licences.',
            lab: ''
        },
        {
            id: 'signin-vs-audit-logs',
            topic: 'Governance',
            q: 'Sign-in logs versus audit logs: what does each one show?',
            a: 'Sign-in logs: who signed in, from where, to which app, and what Conditional Access did.\nAudit logs: changes made in the directory, such as a user created or a role assigned.\nTo keep them beyond the built-in retention period, send them to Log Analytics or a storage account with diagnostic settings.',
            lab: ''
        },
        {
            id: 'terms-of-use',
            topic: 'Governance',
            q: 'How do you make users accept a policy document before they can access company resources?',
            a: 'Upload it as a terms of use in Microsoft Entra, then require it with the grant control in a Conditional Access policy. Acceptances are recorded for audit.',
            lab: ''
        }
    ]
};

window.SC300_CARDS = window.NOTES_DECK.cards;
