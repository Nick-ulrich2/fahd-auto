/**
 * Contenus longs (pages « Comment ça marche », FAQ, pages légales), par langue.
 * ⚠️ Le processus de vente et les conditions sont un modèle : faites-les valider et adaptez-les à votre fonctionnement réel.
 * Les informations de l'entreprise viennent de COMPANY dans src/config.ts.
 */
import type { Lang } from "../i18n/I18nContext";

export interface Section {
  h: string;
  p: string[];
}

interface Content {
  how: {
    title: string;
    subtitle: string;
    stepsTitle: string;
    steps: { t: string; d: string }[];
    payTitle: string;
    pay: string[];
    scamTitle: string;
    scam: string[];
    docsTitle: string;
    docs: string[];
    faqTitle: string;
    faq: { q: string; a: string }[];
  };
  legal: { title: string; sections: Section[] };
  privacy: { title: string; updated: string; sections: Section[] };
  terms: { title: string; notice: string; sections: Section[] };
}

const fr: Content = {
  how: {
    title: "Comment acheter chez Fahd Auto",
    subtitle:
      "Acheter un véhicule à distance doit être simple et sûr. Voici exactement comment se déroule un achat, de votre premier message à la remise des clés, que vous soyez en Afrique, en Europe ou à Dubaï.",
    stepsTitle: "Les étapes de votre achat",
    steps: [
      { t: "Choisissez votre véhicule", d: "Parcourez les annonces ou envoyez-nous une demande de recherche : marque, budget, pays de livraison." },
      { t: "Échangez avec nous sur WhatsApp", d: "Nous répondons à vos questions et vous envoyons des photos et vidéos réelles du véhicule, du compteur et des documents." },
      { t: "Négociez et recevez une offre écrite", d: "Une fois le prix convenu, vous recevez une facture proforma au nom de l'entreprise, avec le véhicule, le prix, le transport et les conditions." },
      { t: "Réservez le véhicule", d: "Le véhicule est réservé pour vous à la réception de l'acompte, par virement bancaire sur le compte de l'entreprise. Vous recevez un reçu." },
      { t: "Préparation et expédition", d: "Contrôle, documents d'export, transport jusqu'au port puis expédition en RoRo ou en conteneur. Vous recevez le connaissement (Bill of Lading)." },
      { t: "Réception de votre véhicule", d: "Après paiement du solde, les documents originaux vous sont envoyés pour le dédouanement et la récupération au port." },
    ],
    payTitle: "Payer en toute sécurité",
    pay: [
      "Tout achat fait l'objet d'une facture proforma écrite, au nom de l'entreprise, avant le moindre paiement.",
      "Les paiements se font uniquement par virement bancaire sur le compte professionnel indiqué sur la facture.",
      "Chaque paiement donne lieu à un reçu écrit.",
      "Vous pouvez faire inspecter le véhicule par un proche, un transitaire ou un expert de votre choix avant de payer le solde.",
    ],
    scamTitle: "Attention aux arnaques",
    scam: [
      "Nos seuls contacts officiels sont ceux affichés sur ce site : WhatsApp {phone} et {email}.",
      "Nous ne vous demanderons jamais de payer sur un compte personnel, à un intermédiaire ou par carte cadeau ou cryptomonnaie.",
      "En cas de doute sur un message reçu en notre nom, contactez-nous directement par WhatsApp avant tout paiement.",
    ],
    docsTitle: "Documents remis avec le véhicule",
    docs: [
      "Facture de vente au nom de l'acheteur",
      "Certificat d'immatriculation ou titre de propriété",
      "Certificat de conformité (COC) pour les véhicules européens",
      "Car-Pass (kilométrage certifié) pour les voitures immatriculées en Belgique",
      "Documents d'export et connaissement (Bill of Lading) pour le transport maritime",
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      { q: "Les prix affichés sont-ils négociables ?", a: "Oui. Les prix « à partir de » sont indicatifs : envoyez-nous votre offre sur WhatsApp ou par email, nous en discutons." },
      { q: "Les photos sont-elles celles du véhicule en vente ?", a: "Certaines annonces utilisent des photos d'illustration du modèle, signalées sous la galerie. Avant toute réservation, nous vous envoyons des photos et vidéos réelles du véhicule." },
      { q: "Puis-je voir ou faire inspecter le véhicule ?", a: "Oui. Vous pouvez venir le voir sur rendez-vous, ou mandater un proche, un transitaire ou un expert indépendant pour l'inspecter avant le paiement du solde." },
      { q: "Comment se passe le paiement ?", a: "Par virement bancaire uniquement, sur le compte de l'entreprise indiqué sur la facture proforma : un acompte pour réserver, puis le solde avant la remise des documents originaux. Chaque paiement donne lieu à un reçu." },
      { q: "Livrez-vous dans mon pays ?", a: "Nous expédions vers les principaux ports d'Afrique de l'Ouest et centrale, du Maghreb et du Moyen-Orient, et livrons en Europe par camion. Demandez un devis avec votre ville ou votre port." },
      { q: "Qui paie le dédouanement et les taxes ?", a: "Les droits de douane et taxes d'importation sont payés par l'acheteur dans le pays de destination. Notre calculateur donne une estimation ; un transitaire local vous donnera le montant exact." },
      { q: "Combien de temps dure la livraison ?", a: "Cela dépend du port de départ, du port d'arrivée et du mode d'expédition. Le délai estimé est indiqué dans votre devis." },
      { q: "Le kilométrage est-il garanti ?", a: "Pour les voitures immatriculées en Belgique, le kilométrage est certifié par le Car-Pass. Pour les autres véhicules, l'historique disponible vous est communiqué." },
      { q: "Les véhicules sont-ils garantis ?", a: "La garantie éventuelle est indiquée dans chaque fiche. Sinon, elle est précisée sur demande et dans la facture." },
      { q: "Vendez-vous aussi depuis Dubaï ?", a: "Oui. Certains véhicules (spécifications GCC) sont situés à Dubaï et peuvent être expédiés en Afrique ou livrés sur place aux Émirats." },
      { q: "Je ne trouve pas le véhicule que je cherche.", a: "Remplissez notre formulaire de recherche personnalisée : nous vous prévenons dès que nous trouvons un véhicule qui correspond." },
    ],
  },
  legal: {
    title: "Mentions légales",
    sections: [
      { h: "Éditeur du site", p: ["{company}", "WhatsApp et téléphone : {phone} · Email : {email}"] },
      { h: "Hébergement", p: ["{host}"] },
      {
        h: "Propriété intellectuelle",
        p: [
          "Le nom, le logo et les textes de Fahd Auto — Trirex Motors Transit sont protégés. Toute reproduction sans autorisation est interdite.",
          "Les photos d'illustration proviennent de Wikimedia Commons et sont utilisées selon leurs licences libres ; leurs auteurs et licences sont indiqués sur la page Crédits photo.",
        ],
      },
      {
        h: "Responsabilité",
        p: [
          "Les annonces, prix et caractéristiques sont donnés à titre indicatif et peuvent contenir des erreurs. Seuls la facture proforma et le contrat de vente engagent les parties.",
        ],
      },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : octobre 2026",
    sections: [
      { h: "Responsable du traitement", p: ["{company}", "Contact : {email}"] },
      {
        h: "Données que nous recevons",
        p: [
          "Le site ne demande ni compte ni mot de passe et n'enregistre pas de formulaire sur un serveur.",
          "Quand vous nous contactez par WhatsApp ou email, nous recevons les informations que vous choisissez de nous envoyer (nom, numéro, pays, véhicule recherché). Elles servent uniquement à répondre à votre demande et à préparer votre achat.",
        ],
      },
      {
        h: "Stockage sur votre appareil",
        p: [
          "Vos favoris, votre liste de comparaison et votre devise préférée sont enregistrés uniquement dans votre navigateur (stockage local). Vous pouvez les effacer à tout moment.",
        ],
      },
      {
        h: "Mesure d'audience",
        p: [
          "Nous pouvons mesurer la fréquentation du site de façon anonyme, sans cookie (Plausible). Si Google Analytics est utilisé, il n'est activé qu'avec votre accord.",
        ],
      },
      {
        h: "Services tiers",
        p: ["WhatsApp (Meta) et votre messagerie traitent vos messages selon leurs propres politiques de confidentialité."],
      },
      {
        h: "Vos droits",
        p: ["Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à {email}. Vous pouvez aussi saisir l'autorité de protection des données de votre pays."],
      },
    ],
  },
  terms: {
    title: "Conditions générales de vente",
    notice: "Résumé des conditions applicables. Les conditions précises de chaque vente figurent sur la facture proforma.",
    sections: [
      { h: "Annonces et prix", p: ["Les annonces ne constituent pas une offre ferme. Les prix sont indicatifs, négociables et exprimés hors transport, assurance, droits de douane et taxes du pays de destination, sauf mention contraire."] },
      { h: "Formation de la vente", p: ["La vente est conclue par l'acceptation écrite de la facture proforma (véhicule, prix, modalités de paiement et de livraison) et le paiement de l'acompte."] },
      { h: "Paiement", p: ["Les paiements sont effectués uniquement par virement bancaire sur le compte de l'entreprise mentionné sur la facture. La propriété du véhicule est transférée après paiement complet."] },
      { h: "Livraison et transport", p: ["Les modalités de transport (port de départ, port ou lieu d'arrivée, répartition des frais et des risques) sont précisées sur la facture. Le dédouanement à destination est à la charge de l'acheteur, sauf accord contraire."] },
      { h: "État du véhicule", p: ["Le véhicule est vendu dans l'état décrit dans l'annonce et dans les photos et vidéos réelles transmises avant la vente. L'acheteur peut le faire inspecter avant le paiement du solde."] },
      { h: "Garanties", p: ["Les garanties légales applicables au consommateur s'appliquent. Toute garantie commerciale éventuelle est précisée par écrit."] },
      { h: "Réclamations", p: ["Toute réclamation peut être adressée à {email}. Nous recherchons toujours une solution à l'amiable."] },
    ],
  },
};

const en: Content = {
  how: {
    title: "How to buy from Fahd Auto",
    subtitle:
      "Buying a vehicle remotely should be simple and safe. Here is exactly how a purchase works, from your first message to handing over the keys, whether you are in Africa, Europe or Dubai.",
    stepsTitle: "Your purchase, step by step",
    steps: [
      { t: "Choose your vehicle", d: "Browse the listings or send us a search request: make, budget, delivery country." },
      { t: "Talk to us on WhatsApp", d: "We answer your questions and send you real photos and videos of the vehicle, the odometer and the documents." },
      { t: "Negotiate and get a written offer", d: "Once the price is agreed, you receive a pro-forma invoice in the company's name showing the vehicle, price, shipping and terms." },
      { t: "Reserve the vehicle", d: "The vehicle is reserved for you once the deposit is received by bank transfer to the company account. You receive a receipt." },
      { t: "Preparation and shipping", d: "Inspection, export documents, transport to the port, then RoRo or container shipping. You receive the Bill of Lading." },
      { t: "Receive your vehicle", d: "After the balance is paid, the original documents are sent to you for customs clearance and collection at the port." },
    ],
    payTitle: "Pay safely",
    pay: [
      "Every purchase comes with a written pro-forma invoice in the company's name before any payment.",
      "Payments are made only by bank transfer to the business account shown on the invoice.",
      "Every payment is confirmed with a written receipt.",
      "You can have the vehicle inspected by a relative, a forwarding agent or an expert of your choice before paying the balance.",
    ],
    scamTitle: "Beware of scams",
    scam: [
      "Our only official contacts are the ones shown on this website: WhatsApp {phone} and {email}.",
      "We will never ask you to pay into a personal account, to a middleman, or with gift cards or cryptocurrency.",
      "If you have any doubt about a message sent in our name, contact us directly on WhatsApp before paying anything.",
    ],
    docsTitle: "Documents supplied with the vehicle",
    docs: [
      "Sales invoice in the buyer's name",
      "Registration certificate or title",
      "Certificate of Conformity (COC) for European vehicles",
      "Car-Pass (certified mileage) for cars registered in Belgium",
      "Export documents and Bill of Lading for sea freight",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Are the prices negotiable?", a: "Yes. “From” prices are indicative: send us your offer on WhatsApp or by email and let's talk." },
      { q: "Are the photos of the actual vehicle for sale?", a: "Some listings use illustration photos of the model, flagged under the gallery. Before any reservation, we send you real photos and videos of the vehicle." },
      { q: "Can I see or inspect the vehicle?", a: "Yes. You can visit by appointment, or ask a relative, a forwarding agent or an independent expert to inspect it before paying the balance." },
      { q: "How does payment work?", a: "By bank transfer only, to the company account shown on the pro-forma invoice: a deposit to reserve, then the balance before the original documents are handed over. Every payment is receipted." },
      { q: "Do you deliver to my country?", a: "We ship to the main ports of West and Central Africa, North Africa and the Middle East, and deliver by truck within Europe. Ask for a quote with your city or port." },
      { q: "Who pays customs duties and taxes?", a: "Import duties and taxes are paid by the buyer in the destination country. Our calculator gives an estimate; a local forwarding agent will give you the exact amount." },
      { q: "How long does delivery take?", a: "It depends on the departure port, the arrival port and the shipping method. The estimated lead time is stated in your quote." },
      { q: "Is the mileage guaranteed?", a: "For cars registered in Belgium, mileage is certified by the Car-Pass. For other vehicles, the available history is shared with you." },
      { q: "Do vehicles come with a warranty?", a: "Any warranty is stated in each listing. Otherwise it is confirmed on request and on the invoice." },
      { q: "Do you also sell from Dubai?", a: "Yes. Some vehicles (GCC specifications) are located in Dubai and can be shipped to Africa or delivered locally in the UAE." },
      { q: "I can't find the vehicle I'm looking for.", a: "Fill in our search request form: we will let you know as soon as we find a matching vehicle." },
    ],
  },
  legal: {
    title: "Legal notice",
    sections: [
      { h: "Website publisher", p: ["{company}", "WhatsApp and phone: {phone} · Email: {email}"] },
      { h: "Hosting", p: ["{host}"] },
      {
        h: "Intellectual property",
        p: [
          "The Fahd Auto — Trirex Motors Transit name, logo and texts are protected. Any reproduction without permission is prohibited.",
          "Illustration photos come from Wikimedia Commons and are used under their free licences; authors and licences are listed on the Photo credits page.",
        ],
      },
      { h: "Liability", p: ["Listings, prices and specifications are indicative and may contain errors. Only the pro-forma invoice and the sales contract are binding."] },
    ],
  },
  privacy: {
    title: "Privacy policy",
    updated: "Last updated: October 2026",
    sections: [
      { h: "Data controller", p: ["{company}", "Contact: {email}"] },
      {
        h: "Data we receive",
        p: [
          "The website requires no account or password and does not store any form on a server.",
          "When you contact us by WhatsApp or email, we receive the information you choose to send (name, number, country, vehicle wanted). It is used only to answer your request and prepare your purchase.",
        ],
      },
      { h: "Storage on your device", p: ["Your favourites, comparison list and preferred currency are stored only in your browser (local storage). You can clear them at any time."] },
      { h: "Audience measurement", p: ["We may measure website traffic anonymously, without cookies (Plausible). If Google Analytics is used, it is only enabled with your consent."] },
      { h: "Third-party services", p: ["WhatsApp (Meta) and your email provider process your messages under their own privacy policies."] },
      { h: "Your rights", p: ["You can ask to access, correct or delete your data by writing to {email}. You may also contact the data protection authority in your country."] },
    ],
  },
  terms: {
    title: "Terms of sale",
    notice: "Summary of the applicable terms. The specific terms of each sale are set out on the pro-forma invoice.",
    sections: [
      { h: "Listings and prices", p: ["Listings are not a binding offer. Prices are indicative, negotiable and exclude shipping, insurance, customs duties and destination taxes unless stated otherwise."] },
      { h: "Formation of the sale", p: ["The sale is concluded by written acceptance of the pro-forma invoice (vehicle, price, payment and delivery terms) and payment of the deposit."] },
      { h: "Payment", p: ["Payments are made only by bank transfer to the company account shown on the invoice. Ownership passes after full payment."] },
      { h: "Delivery and shipping", p: ["Shipping terms (departure port, arrival port or place, allocation of costs and risks) are set out on the invoice. Customs clearance at destination is the buyer's responsibility unless agreed otherwise."] },
      { h: "Condition of the vehicle", p: ["The vehicle is sold in the condition described in the listing and in the real photos and videos sent before the sale. The buyer may have it inspected before paying the balance."] },
      { h: "Warranties", p: ["Statutory consumer guarantees apply. Any commercial warranty is confirmed in writing."] },
      { h: "Complaints", p: ["Complaints can be sent to {email}. We always seek an amicable solution."] },
    ],
  },
};

const ar: Content = {
  how: {
    title: "كيف تشتري من فهد أوتو",
    subtitle:
      "شراء مركبة عن بُعد يجب أن يكون بسيطًا وآمنًا. إليك بالضبط كيف تتم عملية الشراء، من رسالتك الأولى حتى تسليم المفاتيح، سواء كنت في أفريقيا أو أوروبا أو دبي.",
    stepsTitle: "خطوات الشراء",
    steps: [
      { t: "اختر مركبتك", d: "تصفح الإعلانات أو أرسل لنا طلب بحث: الماركة، الميزانية، بلد التسليم." },
      { t: "تواصل معنا عبر واتساب", d: "نجيب عن أسئلتك ونرسل لك صورًا وفيديوهات حقيقية للمركبة والعداد والوثائق." },
      { t: "تفاوض واحصل على عرض مكتوب", d: "بعد الاتفاق على السعر تحصل على فاتورة مبدئية باسم الشركة تتضمن المركبة والسعر والشحن والشروط." },
      { t: "احجز المركبة", d: "تُحجز المركبة لك عند استلام العربون عبر تحويل بنكي إلى حساب الشركة، وتحصل على إيصال." },
      { t: "التجهيز والشحن", d: "الفحص، وثائق التصدير، النقل إلى الميناء ثم الشحن بنظام RoRo أو في حاوية. تحصل على بوليصة الشحن." },
      { t: "استلام مركبتك", d: "بعد دفع المبلغ المتبقي تُرسل إليك الوثائق الأصلية للتخليص الجمركي والاستلام من الميناء." },
    ],
    payTitle: "ادفع بأمان",
    pay: [
      "كل عملية شراء تتم بفاتورة مبدئية مكتوبة باسم الشركة قبل أي دفع.",
      "تتم المدفوعات فقط عبر تحويل بنكي إلى الحساب التجاري المذكور في الفاتورة.",
      "كل دفعة يقابلها إيصال مكتوب.",
      "يمكنك فحص المركبة عن طريق قريب أو وكيل شحن أو خبير تختاره قبل دفع المبلغ المتبقي.",
    ],
    scamTitle: "احذر من الاحتيال",
    scam: [
      "وسائل الاتصال الرسمية الوحيدة هي المعروضة على هذا الموقع: واتساب {phone} و {email}.",
      "لن نطلب منك أبدًا الدفع إلى حساب شخصي أو إلى وسيط أو ببطاقات هدايا أو عملات رقمية.",
      "إذا شككت في رسالة باسمنا، تواصل معنا مباشرة عبر واتساب قبل أي دفع.",
    ],
    docsTitle: "الوثائق المسلّمة مع المركبة",
    docs: [
      "فاتورة البيع باسم المشتري",
      "شهادة التسجيل أو سند الملكية",
      "شهادة المطابقة (COC) للمركبات الأوروبية",
      "Car-Pass (عداد موثّق) للسيارات المسجلة في بلجيكا",
      "وثائق التصدير وبوليصة الشحن للنقل البحري",
    ],
    faqTitle: "أسئلة شائعة",
    faq: [
      { q: "هل الأسعار المعروضة قابلة للتفاوض؟", a: "نعم. الأسعار «ابتداءً من» استرشادية: أرسل لنا عرضك عبر واتساب أو البريد ولنتحدث." },
      { q: "هل الصور هي صور المركبة المعروضة؟", a: "بعض الإعلانات تستخدم صورًا توضيحية للطراز، مع الإشارة إلى ذلك تحت المعرض. قبل أي حجز نرسل لك صورًا وفيديوهات حقيقية للمركبة." },
      { q: "هل يمكنني معاينة المركبة أو فحصها؟", a: "نعم. يمكنك الحضور بموعد مسبق، أو تكليف قريب أو وكيل شحن أو خبير مستقل بفحصها قبل دفع المبلغ المتبقي." },
      { q: "كيف يتم الدفع؟", a: "عبر تحويل بنكي فقط إلى حساب الشركة المذكور في الفاتورة المبدئية: عربون للحجز ثم المبلغ المتبقي قبل تسليم الوثائق الأصلية. كل دفعة يقابلها إيصال." },
      { q: "هل تشحنون إلى بلدي؟", a: "نشحن إلى أهم موانئ غرب ووسط أفريقيا والمغرب العربي والشرق الأوسط، ونسلّم داخل أوروبا بالشاحنة. اطلب عرض سعر مع مدينتك أو ميناءك." },
      { q: "من يدفع الجمارك والضرائب؟", a: "يدفع المشتري الرسوم الجمركية وضرائب الاستيراد في بلد الوصول. حاسبتنا تعطي تقديرًا، ووكيل التخليص المحلي يعطيك المبلغ الدقيق." },
      { q: "كم تستغرق مدة التسليم؟", a: "يعتمد ذلك على ميناء المغادرة وميناء الوصول وطريقة الشحن. المدة التقديرية مذكورة في عرض السعر." },
      { q: "هل عدد الكيلومترات مضمون؟", a: "للسيارات المسجلة في بلجيكا، العداد موثّق بشهادة Car-Pass. للمركبات الأخرى نرسل لك السجل المتوفر." },
      { q: "هل المركبات مضمونة؟", a: "الضمان إن وُجد مذكور في كل إعلان، وإلا يتم تأكيده عند الطلب وفي الفاتورة." },
      { q: "هل تبيعون أيضًا من دبي؟", a: "نعم. بعض المركبات (مواصفات خليجية) موجودة في دبي ويمكن شحنها إلى أفريقيا أو تسليمها داخل الإمارات." },
      { q: "لا أجد المركبة التي أبحث عنها.", a: "املأ نموذج طلب البحث وسنُعلمك فور العثور على مركبة مناسبة." },
    ],
  },
  legal: {
    title: "إشعار قانوني",
    sections: [
      { h: "ناشر الموقع", p: ["{company}", "واتساب والهاتف: {phone} · البريد: {email}"] },
      { h: "الاستضافة", p: ["{host}"] },
      {
        h: "الملكية الفكرية",
        p: [
          "اسم وشعار ونصوص فهد أوتو — Trirex Motors Transit محمية. يُمنع أي نسخ دون إذن.",
          "الصور التوضيحية مصدرها ويكيميديا كومنز وتُستخدم وفق تراخيصها الحرة؛ أسماء المصورين والتراخيص مذكورة في صفحة حقوق الصور.",
        ],
      },
      { h: "المسؤولية", p: ["الإعلانات والأسعار والمواصفات استرشادية وقد تتضمن أخطاء. الفاتورة المبدئية وعقد البيع وحدهما ملزمان."] },
    ],
  },
  privacy: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: أكتوبر 2026",
    sections: [
      { h: "المسؤول عن المعالجة", p: ["{company}", "التواصل: {email}"] },
      {
        h: "البيانات التي نستلمها",
        p: [
          "لا يتطلب الموقع حسابًا أو كلمة مرور ولا يحفظ أي نموذج على خادم.",
          "عند تواصلك معنا عبر واتساب أو البريد نستلم المعلومات التي تختار إرسالها (الاسم، الرقم، البلد، المركبة المطلوبة)، وتُستخدم فقط للرد على طلبك وتجهيز عملية الشراء.",
        ],
      },
      { h: "التخزين على جهازك", p: ["تُحفظ المفضلة وقائمة المقارنة والعملة المفضلة في متصفحك فقط، ويمكنك حذفها في أي وقت."] },
      { h: "قياس الزيارات", p: ["قد نقيس زيارات الموقع بشكل مجهول ودون ملفات تعريف (Plausible). إذا استُخدم Google Analytics فلا يُفعَّل إلا بموافقتك."] },
      { h: "خدمات الغير", p: ["يعالج واتساب (Meta) ومزوّد بريدك رسائلك وفق سياسات الخصوصية الخاصة بهما."] },
      { h: "حقوقك", p: ["يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها بمراسلتنا على {email}، كما يمكنك اللجوء إلى هيئة حماية البيانات في بلدك."] },
    ],
  },
  terms: {
    title: "الشروط العامة للبيع",
    notice: "ملخص الشروط المطبقة. الشروط الدقيقة لكل عملية بيع مذكورة في الفاتورة المبدئية.",
    sections: [
      { h: "الإعلانات والأسعار", p: ["الإعلانات ليست عرضًا ملزمًا. الأسعار استرشادية وقابلة للتفاوض ولا تشمل الشحن والتأمين والرسوم الجمركية وضرائب بلد الوصول ما لم يُذكر خلاف ذلك."] },
      { h: "إبرام البيع", p: ["يُبرم البيع بالموافقة المكتوبة على الفاتورة المبدئية (المركبة، السعر، شروط الدفع والتسليم) ودفع العربون."] },
      { h: "الدفع", p: ["تتم المدفوعات فقط عبر تحويل بنكي إلى حساب الشركة المذكور في الفاتورة. تنتقل الملكية بعد الدفع الكامل."] },
      { h: "التسليم والشحن", p: ["شروط الشحن (ميناء المغادرة، ميناء أو مكان الوصول، توزيع التكاليف والمخاطر) مذكورة في الفاتورة. التخليص الجمركي في بلد الوصول على عاتق المشتري ما لم يُتفق على خلاف ذلك."] },
      { h: "حالة المركبة", p: ["تُباع المركبة بالحالة الموصوفة في الإعلان وفي الصور والفيديوهات الحقيقية المرسلة قبل البيع. يمكن للمشتري فحصها قبل دفع المبلغ المتبقي."] },
      { h: "الضمانات", p: ["تطبق الضمانات القانونية المقررة للمستهلك. أي ضمان تجاري يتم تأكيده كتابيًا."] },
      { h: "الشكاوى", p: ["يمكن إرسال الشكاوى إلى {email}. نسعى دائمًا إلى حل ودي."] },
    ],
  },
};

export const CONTENT: Record<Lang, Content> = { fr, en, ar };
