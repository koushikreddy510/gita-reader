/**
 * Seed corpus.
 *
 * ⚠️ DRAFT CONTENT — NOT READY TO SHIP.
 *
 * This file exists so the reader has something to render while the real corpus
 * is being assembled. It is a curated subset (not all 700 verses) and the
 * English column is an editorial working draft, not a published translation.
 *
 * Before release:
 *   1. Replace it with the full 700-verse corpus: put the dataset on disk and
 *      run `node scripts/import-corpus.mjs corpus/<file>.json`. That writes
 *      `corpus.generated.ts`, which takes precedence over this file.
 *   2. Populate the `arnold` / `telang` / `wilkins` columns from public-domain
 *      editions, not from this file.
 *   3. Have a Sanskrit reader check every Devanagari line — a dropped virama
 *      changes the word.
 *
 * Sanskrit is public domain by age. The other columns are placeholder text we
 * own, so nothing here carries a licensing risk — only an accuracy one.
 */

import type { TranslationId } from '@/constants/settings-options';

export type Verse = {
  ref: string;
  chapter: number;
  verse: number;
  devanagari: string;
  iast: string;
  translations: Partial<Record<TranslationId, string>>;
};

type SeedRow = [
  chapter: number,
  verse: number,
  devanagari: string,
  iast: string,
  editorial: string,
];

const SEED: SeedRow[] = [
  [
    1,
    1,
    'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥',
    'dharma-kṣetre kurukṣetre samavetā yuyutsavaḥ |\nmāmakāḥ pāṇḍavāś caiva kim akurvata sañjaya ||',
    'On the field of dharma, on the field of the Kurus, gathered and eager to fight — what did my people and the sons of Pandu do, Sanjaya?',
  ],
  [
    2,
    11,
    'अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे।\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः॥',
    'aśocyān anvaśocas tvaṁ prajñā-vādāṁś ca bhāṣase |\ngatāsūn agatāsūṁś ca nānuśocanti paṇḍitāḥ ||',
    'You grieve for those who should not be grieved for, yet you speak as one who knows. The wise grieve neither for the living nor for the dead.',
  ],
  [
    2,
    13,
    'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति॥',
    "dehino 'smin yathā dehe kaumāraṁ yauvanaṁ jarā |\ntathā dehāntara-prāptir dhīras tatra na muhyati ||",
    'As the self in this body passes through childhood, youth and old age, so it passes into another body. The steady one is not confused by this.',
  ],
  [
    2,
    14,
    'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ |\nāgamāpāyino 'nityās tāṁs titikṣasva bhārata ||",
    'Pleasure and pain, cold and heat, come and go. They are temporary. Bear them patiently, Arjuna.',
  ],
  [
    2,
    20,
    'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥',
    "na jāyate mriyate vā kadācin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ |\najo nityaḥ śāśvato 'yaṁ purāṇo na hanyate hanyamāne śarīre ||",
    'The self is never born and never dies. It has not come into being, and it will not cease to be. Unborn, eternal, unchanging, it is not slain when the body is slain.',
  ],
  [
    2,
    22,
    'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥',
    "vāsāṁsi jīrṇāni yathā vihāya navāni gṛhṇāti naro 'parāṇi |\ntathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī ||",
    'As a person casts off worn-out clothes and puts on new ones, so the self casts off worn-out bodies and enters others that are new.',
  ],
  [
    2,
    47,
    'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    "karmaṇy evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||",
    'You have a right to the action, never to its fruits. Do not let the fruit be your motive, and do not cling to inaction.',
  ],
  [
    2,
    48,
    'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
    'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||',
    'Established in yoga, do your work, letting go of attachment, even-minded in success and failure. That evenness of mind is called yoga.',
  ],
  [
    2,
    56,
    'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते॥',
    'duḥkheṣv anudvigna-manāḥ sukheṣu vigata-spṛhaḥ |\nvīta-rāga-bhaya-krodhaḥ sthita-dhīr munir ucyate ||',
    'One whose mind is undisturbed by sorrow, who has no craving for pleasure, who is free of attachment, fear and anger — that one is a sage of steady wisdom.',
  ],
  [
    2,
    62,
    'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥',
    "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate |\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate ||",
    'When the mind dwells on objects, attachment to them forms. From attachment comes desire. From desire, anger is born.',
  ],
  [
    2,
    63,
    'क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥',
    'krodhād bhavati sammohaḥ sammohāt smṛti-vibhramaḥ |\nsmṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati ||',
    'From anger comes confusion. From confusion, the loss of memory. From loss of memory, the ruin of discernment. And when discernment is gone, you are lost.',
  ],
  [
    2,
    69,
    'या निशा सर्वभूतानां तस्यां जागर्ति संयमी।\nयस्यां जाग्रति भूतानि सा निशा पश्यतो मुनेः॥',
    'yā niśā sarva-bhūtānāṁ tasyāṁ jāgarti saṁyamī |\nyasyāṁ jāgrati bhūtāni sā niśā paśyato muneḥ ||',
    'What is night for all beings is the time of waking for the self-restrained. And what is waking for all beings is night for the sage who sees.',
  ],
  [
    2,
    70,
    'आपूर्यमाणमचलप्रतिष्ठं समुद्रमापः प्रविशन्ति यद्वत्।\nतद्वत्कामा यं प्रविशन्ति सर्वे स शान्तिमाप्नोति न कामकामी॥',
    'āpūryamāṇam acala-pratiṣṭhaṁ samudram āpaḥ praviśanti yadvat |\ntadvat kāmā yaṁ praviśanti sarve sa śāntim āpnoti na kāma-kāmī ||',
    'As waters pour into a sea that is full to the brim and never overflows, so desires flow into the one who is calm. Such a person finds peace — not the one who runs after desires.',
  ],
  [
    3,
    35,
    'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥',
    'śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt |\nsva-dharme nidhanaṁ śreyaḥ para-dharmo bhayāvahaḥ ||',
    "Better to do your own duty badly than another's duty well. Better to die in your own dharma; the dharma of another is dangerous.",
  ],
  [
    4,
    7,
    'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    'yadā yadā hi dharmasya glānir bhavati bhārata |\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham ||',
    'Whenever dharma declines and its opposite rises, Arjuna, I send myself forth.',
  ],
  [
    4,
    8,
    'परित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥',
    'paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām |\ndharma-saṁsthāpanārthāya sambhavāmi yuge yuge ||',
    'For the protection of the good, for the destruction of those who do harm, and for the re-establishment of dharma, I come into being age after age.',
  ],
  [
    4,
    34,
    'तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया।\nउपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः॥',
    'tad viddhi praṇipātena paripraśnena sevayā |\nupadekṣyanti te jñānaṁ jñāninas tattva-darśinaḥ ||',
    'Know this by bowing, by asking, and by serving. Those who know, who see the truth, will teach you knowledge.',
  ],
  [
    5,
    10,
    'ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः।\nलिप्यते न स पापेन पद्मपत्रमिवाम्भसा॥',
    'brahmaṇy ādhāya karmāṇi saṅgaṁ tyaktvā karoti yaḥ |\nlipyate na sa pāpena padma-patram ivāmbhasā ||',
    'One who acts, offering actions to Brahman and letting go of attachment, is not stained by them — as a lotus leaf is not wet by water.',
  ],
  [
    6,
    5,
    'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    'uddhared ātmanātmānaṁ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||',
    'Lift yourself by yourself; do not let yourself fall. For the self alone is the friend of the self, and the self alone is its enemy.',
  ],
  [
    6,
    35,
    'असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥',
    'asaṁśayaṁ mahā-bāho mano durnigrahaṁ calam |\nabhyāsena tu kaunteya vairāgyeṇa ca gṛhyate ||',
    'Without doubt, Arjuna, the mind is restless and hard to restrain. But by practice and by letting go of craving, it can be held.',
  ],
  [
    7,
    19,
    'बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते।\nवासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥',
    'bahūnāṁ janmanām ante jñānavān māṁ prapadyate |\nvāsudevaḥ sarvam iti sa mahātmā sudurlabhaḥ ||',
    'After many births, the one who knows arrives at me, saying: Vasudeva is all. Such a soul, so hard to find, is great.',
  ],
  [
    8,
    6,
    'यं यं वापि स्मरन्भावं त्यजत्यन्ते कलेवरम्।\nतं तमेवैति कौन्तेय सदा तद्भावभावितः॥',
    'yaṁ yaṁ vāpi smaran bhāvaṁ tyajaty ante kalevaram |\ntaṁ tam evaiti kaunteya sadā tad-bhāva-bhāvitaḥ ||',
    'Whatever state one remembers when leaving the body at the end, that is the state one reaches — shaped by what one has dwelt on.',
  ],
  [
    8,
    7,
    'तस्मात्सर्वेषु कालेषु मामनुस्मर युध्य च।\nमय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयम्॥',
    'tasmāt sarveṣu kāleṣu mām anusmara yudhya ca |\nmayy arpita-mano-buddhir mām evaiṣyasy asaṁśayam ||',
    'So remember me at every moment, and fight. With mind and discernment offered to me, you will come to me without doubt.',
  ],
  [
    9,
    22,
    'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    'ananyāś cintayanto māṁ ye janāḥ paryupāsate |\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham ||',
    'For those who think of me alone and worship me without other consideration, I carry what they lack and preserve what they have.',
  ],
  [
    9,
    26,
    'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥',
    'patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati |\ntad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ ||',
    'A leaf, a flower, a fruit, a little water — whatever you offer me with devotion, I accept it, offered by a sincere heart.',
  ],
  [
    9,
    34,
    'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि युक्त्वैवमात्मानं मत्परायणः॥',
    'man-manā bhava mad-bhakto mad-yājī māṁ namaskuru |\nmām evaiṣyasi yuktvaivam ātmānaṁ mat-parāyaṇaḥ ||',
    'Fix your mind on me, be devoted to me, worship me, bow to me. Having yoked yourself to me this way, you will come to me.',
  ],
  [
    10,
    8,
    'अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते।\nइति मत्वा भजन्ते मां बुधा भावसमन्विताः॥',
    'ahaṁ sarvasya prabhavo mattaḥ sarvaṁ pravartate |\niti matvā bhajante māṁ budhā bhāva-samanvitāḥ ||',
    'I am the source of everything; from me all things proceed. Knowing this, the wise worship me, their hearts full.',
  ],
  [
    10,
    41,
    'यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा।\nतत्तदेवावगच्छ त्वं मम तेजोंऽशसम्भवम्॥',
    "yad yad vibhūtimat sattvaṁ śrīmad ūrjitam eva vā |\ntat tad evāvagaccha tvaṁ mama tejo-'ṁśa-sambhavam ||",
    'Whatever is glorious, good or powerful, know it to be a spark of my splendour.',
  ],
  [
    11,
    12,
    'दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता।\nयदि भाः सदृशी सा स्याद्भासस्तस्य महात्मनः॥',
    'divi sūrya-sahasrasya bhaved yugapad utthitā |\nyadi bhāḥ sadṛśī sā syād bhāsas tasya mahātmanaḥ ||',
    'If a thousand suns rose in the sky at once, that light might resemble the splendour of that great being.',
  ],
  [
    11,
    32,
    'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो लोकान्समाहर्तुमिह प्रवृत्तः।\nऋतेऽपि त्वां न भविष्यन्ति सर्वे येऽवस्थिताः प्रत्यनीके॥',
    "kālo 'smi loka-kṣaya-kṛt pravṛddho lokān samāhartum iha pravṛttaḥ |\nṛte 'pi tvāṁ na bhaviṣyanti sarve ye 'vasthitāḥ pratyanīke ||",
    'I am time, grown vast, the destroyer of worlds, come here to consume them. Even without you, none of these warriors facing you will remain.',
  ],
  [
    11,
    33,
    'तस्मात्त्वमुत्तिष्ठ यशो लभस्व जित्वा शत्रून्भुङ्क्ष्व राज्यं समृद्धम्।\nमयैवैते निहताः पूर्वमेव निमित्तमात्रं भव सव्यसाचिन्॥',
    'tasmāt tvam uttiṣṭha yaśo labhasva jitvā śatrūn bhuṅkṣva rājyaṁ samṛddham |\nmayaivaite nihatāḥ pūrvam eva nimitta-mātraṁ bhava savya-sācin ||',
    'So rise. Win glory. Defeat your enemies and enjoy a flourishing kingdom. They are already struck down by me. Be only the instrument, Arjuna.',
  ],
  [
    12,
    13,
    'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥',
    'adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca |\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī ||',
    'One who bears no hatred toward any being, who is friendly and compassionate, free of possessiveness and pride, even in pleasure and pain, and forgiving —',
  ],
  [
    12,
    14,
    'सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः।\nमय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः॥',
    'santuṣṭaḥ satataṁ yogī yatātmā dṛḍha-niścayaḥ |\nmayy arpita-mano-buddhir yo mad-bhaktaḥ sa me priyaḥ ||',
    '— ever content, a yogi with the self restrained, firm in resolve, with mind and discernment given to me: that devotee is dear to me.',
  ],
  [
    12,
    15,
    'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः।\nहर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः॥',
    'yasmān nodvijate loko lokān nodvijate ca yaḥ |\nharṣāmarṣa-bhayodvegair mukto yaḥ sa ca me priyaḥ ||',
    'One who does not disturb the world and whom the world does not disturb, free of joy, impatience, fear and agitation — that one is dear to me.',
  ],
  [
    13,
    1,
    'इदं शरीरं कौन्तेय क्षेत्रमित्यभिधीयते।\nएतद्यो वेत्ति तं प्राहुः क्षेत्रज्ञ इति तद्विदः॥',
    'idaṁ śarīraṁ kaunteya kṣetram ity abhidhīyate |\netad yo vetti taṁ prāhuḥ kṣetra-jña iti tad-vidaḥ ||',
    'This body is called the field, Arjuna. One who knows it, those who know, call the knower of the field.',
  ],
  [
    14,
    5,
    'सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः।\nनिबध्नन्ति महाबाहो देहे देहिनमव्ययम्॥',
    'sattvaṁ rajas tama iti guṇāḥ prakṛti-sambhavāḥ |\nnibadhnanti mahā-bāho dehe dehinam avyayam ||',
    'Sattva, rajas and tamas — these qualities, born of nature, bind the imperishable self to the body.',
  ],
  [
    15,
    15,
    'सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च।\nवेदैश्च सर्वैरहमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम्॥',
    'sarvasya cāhaṁ hṛdi sanniviṣṭo mattaḥ smṛtir jñānam apohanaṁ ca |\nvedaiś ca sarvair aham eva vedyo vedānta-kṛd veda-vid eva cāham ||',
    'I am seated in the heart of every being. From me come memory, knowledge and their loss. I am what all the Vedas seek to know; I am the author of Vedanta and the knower of the Vedas.',
  ],
  [
    16,
    21,
    'त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्॥',
    'tri-vidhaṁ narakasyedaṁ dvāraṁ nāśanam ātmanaḥ |\nkāmaḥ krodhas tathā lobhas tasmād etat trayaṁ tyajet ||',
    'Three gates lead to the ruin of the self: desire, anger and greed. Let these three go.',
  ],
  [
    17,
    3,
    'सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः॥',
    'sattvānurūpā sarvasya śraddhā bhavati bhārata |\nśraddhā-mayo ‘yaṁ puruṣo yo yac-chraddhaḥ sa eva saḥ ||',
    'Each person’s faith follows their nature. A person is made of faith; as their faith is, so are they.',
  ],
  [
    18,
    5,
    'यज्ञदानतपःकर्म न त्याज्यं कार्यमेव तत्।\nयज्ञो दानं तपश्चैव पावनानि मनीषिणाम्॥',
    'yajña-dāna-tapaḥ-karma na tyājyaṁ kāryam eva tat |\nyajño dānaṁ tapaś caiva pāvanāni manīṣiṇām ||',
    'Sacrifice, giving and austerity are not to be abandoned; they should be performed. Sacrifice, giving and austerity purify the wise.',
  ],
  [
    18,
    61,
    'ईश्वरः सर्वभूतानां हृद्देशेऽर्जुन तिष्ठति।\nभ्रामयन्सर्वभूतानि यन्त्रारूढानि मायया॥',
    "īśvaraḥ sarva-bhūtānāṁ hṛd-deśe 'rjuna tiṣṭhati |\nbhrāmayan sarva-bhūtāni yantrārūḍhāni māyayā ||",
    'The Lord dwells in the heart of every being, Arjuna, spinning them all by his power as if they were mounted on a machine.',
  ],
  [
    18,
    66,
    'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
    'Let go of all duties and take refuge in me alone. I will free you from every wrong. Do not grieve.',
  ],
  [
    18,
    78,
    'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥',
    'yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanur-dharaḥ |\ntatra śrīr vijayo bhūtir dhruvā nītir matir mama ||',
    'Wherever Krishna, the lord of yoga, is, and Arjuna the archer — there will be fortune, victory, prosperity and firm justice. This is my conviction.',
  ],
];

export const SEED_VERSES: Verse[] = SEED.map(([chapter, verse, devanagari, iast, editorial]) => ({
  ref: `${chapter}.${verse}`,
  chapter,
  verse,
  devanagari,
  iast,
  translations: { editorial },
}));
