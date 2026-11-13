/* Selected primary guidance for the teaching points reviewed 8 October 2026.
 * Targeted presentation additions checked 10–14 November 2026; topicReviews records scope.
 * Links support specific topics, not certification of every statement on a page.
 * Keep titles/URLs explicit: no guessed links generated from citation text.
 */
(function () {
    'use strict';
    const sources = {
        tiaAHA: ["AHA emergency department TIA assessment and risk reduction statement (2023)", "https://www.ahajournals.org/doi/10.1161/STR.0000000000000418"],
        ichESO: ["ESO/EANS spontaneous intracerebral hemorrhage guideline (2025)", "https://academic.oup.com/esj/article/10/4/1007/8377192"],
        meningitisWHO: ["WHO meningitis diagnosis, treatment and care guideline (2025)", "https://www.who.int/publications/i/item/9789240108042"],
        statusAdult: ["Acute management of status epilepticus in adult patients (2025)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12062632/"],
        cvtCanada: ["Canadian Stroke Best Practice Recommendations: cerebral venous thrombosis (2024)", "https://pubmed.ncbi.nlm.nih.gov/38826076/"],
        cvtAHA: ["AHA cerebral venous thrombosis statement (2024)", "https://www.ahajournals.org/doi/10.1161/STR.0000000000000456"],
        acuteHF2026: ["ESC and EUSEM consensus on acute heart failure in emergency settings (2026)", "https://doi.org/10.1093/eurheartj/ehag744"],
        hfESC: ["ESC acute and chronic heart failure guideline (2021)", "https://academic.oup.com/eurheartj/article/42/36/3599/6358045"],
        copdOxygen: ["NICE QS10: emergency oxygen during a COPD exacerbation", "https://www.nice.org.uk/guidance/qs10/chapter/Quality-statement-6-Emergency-oxygen-during-an-exacerbation"],
        goldCOPD: ["GOLD global strategy for COPD (2026)", "https://goldcopd.org/2026-gold-report-and-pocket-guide/"],
        capATS: ["ATS community-acquired pneumonia guideline update (2025, published in 2026 issue)", "https://doi.org/10.1164/rccm.202507-1692ST"],
        capIDSA: ["ATS/IDSA adult community-acquired pneumonia guideline (2019)", "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults"],
        cardiogenicACC: ["ACC evaluation and management of cardiogenic shock (2025)", "https://www.acc.org/Guidelines/Guidelines/2025/03/17/19/42/Cardiogenic-Shock-Concise-Clinical-Guidance"],
        adrenalNICE: ["NICE NG243: adrenal insufficiency and emergency management (2024)", "https://www.nice.org.uk/guidance/ng243/chapter/recommendations"],
        adrenalESE: ["ESE/Endocrine Society glucocorticoid-induced adrenal insufficiency guideline (2024)", "https://www.endocrine.org/journals/jcem/glucocorticoid-induced-adrenal-insufficiency"],
        acepEarlyPregnancy: ["ACEP clinical policy: early pregnancy in the emergency department", "https://www.acep.org/siteassets/new-pdfs/clinical-policies/cp-earlypregnancy-doc.pdf"],
        adnexalTorsion: ["ACOG committee opinion: adnexal torsion in adolescents", "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2019/08/adnexal-torsion-in-adolescents"],
        acutePelvicImaging: ["ACR Appropriateness Criteria: acute pelvic pain in the reproductive age group", "https://acsearch.acr.org/docs/69503/Narrative/"],
        acuteScrotumAUA: ["AUA medical student curriculum: acute scrotum", "https://www.auanet.org/documents/education/Acute-Scrotum.pdf"],
        acuteScrotumEAU: ["EAU paediatric urology guideline: acute scrotum", "https://uroweb.org/guidelines/paediatric-urology/chapter/acute-scrotum"],
        perforatedUlcer: ["WSES perforated and bleeding peptic ulcer guideline (2020)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6947898/"],
        surgicalSourceControl: ["WSES and partner societies: source control in emergency general surgery (2023)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10362628/"],
        cholecystitisEAST: ["EAST high-risk acute cholecystitis guideline (2026)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC13583704/"],
        cholecystitisWSES: ["WSES acute calculous cholecystitis guideline (2020)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/"],
        pancreatitisACG: ["ACG acute pancreatitis guideline (2024)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC13221274/"],
        pancreatitisIAP: ["IAP and partner societies: acute pancreatitis guideline (2025)", "https://doi.org/10.1016/j.pan.2025.04.020"],
        diverticulitisACG: ["ACG colonic diverticulitis guideline (2026)", "https://doi.org/10.14309/ajg.0000000000004047"],
        diverticulitisIDSA: ["IDSA diagnostic imaging for acute diverticulitis (2024)", "https://doi.org/10.1093/cid/ciae350"],
        diverticulitisNICE: ["NICE NG147: diverticular disease", "https://www.nice.org.uk/guidance/ng147/chapter/recommendations"],
        mesentericESVS: ['ESVS mesenteric and renal vessel disease guideline (2025)', 'https://doi.org/10.1016/j.ejvs.2025.06.010'],
        sboEGS: ['Emergency General Surgery Algorithms working group: small bowel obstruction (2025)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12893134/'],
        ercSpecial: ['ERC special circumstances in resuscitation (2025): traumatic arrest', 'https://www.erc.edu/media/wwufbysp/gl2025-06-spec-circ-e.pdf'],
        esophagealPerforation: ['WSES esophageal emergencies guideline (2019)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6544956/'],
        aaaESVS: ['ESVS abdominal aorto-iliac aneurysm guideline (2024)', 'https://doi.org/10.1016/j.ejvs.2023.11.002'],
        sboBologna: ['WSES Bologna guideline for adhesive small bowel obstruction (2017 update)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6006983/'],
        acmtNAC: ["ACMT IV acetylcysteine duration and stopping criteria (2026)", "https://www.acmt.net/news/acmt-practice-statement-duration-of-intravenous-acetylcysteine-therapy-following-acetaminophen-overdose-2026-update/"],
        snapNAC: ["SNAP 12-hour IV acetylcysteine regimen study", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6610779/"],
        cchr: ["Canadian CT Head Rule derivation study", "https://pubmed.ncbi.nlm.nih.gov/11356436/"],
        pecarn: ["PECARN pediatric blunt head trauma decision rule derivation and validation", "https://pubmed.ncbi.nlm.nih.gov/19758692/"],
        intubationACEP: ["ACEP adult emergency endotracheal intubation clinical policy (2026)", "https://www.acep.org/patient-care/clinical-policies/endotracheal-intubation"],
        intubationTrial: ["Ketamine versus etomidate for emergency intubation in critically ill adults, randomized trial", "https://pubmed.ncbi.nlm.nih.gov/41369227/"],
        waoAnaphylaxis: ["World Allergy Organization anaphylaxis guidance (2020)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7607509/"],
        jtfppAnaphylaxis: ["JTFPP anaphylaxis practice parameter (2023 update)", "https://pubmed.ncbi.nlm.nih.gov/38108678/"],
        hillierSodium: ["Hillier et al.: sodium correction estimate in hyperglycemia", "https://pubmed.ncbi.nlm.nih.gov/10225241/"],
        oncologyGI: ["AGIHO/DGHO adult gastrointestinal complications guideline, including neutropenic enterocolitis", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5748412/"],
        neutropenicNICE: ["NICE CG151: neutropenic sepsis in people with cancer", "https://www.nice.org.uk/guidance/cg151/chapter/Recommendations"],
        neutropenicASCO: ["ASCO/IDSA adult fever and neutropenia guideline (2018)", "https://pubmed.ncbi.nlm.nih.gov/29461916/"],
        acuteOncology: ["UKONS acute oncology initial management guidelines", "https://ukons.hosting.sundownsolutions.com/"],
        tlsBSH: ["British Society for Haematology tumor lysis syndrome guideline (2025)", "https://b-s-h.org.uk/guidelines/guidelines/updated-guidelines-for-the-diagnosis-and-management-of-tumour-lysis-syndrome-in-adults-and-children"],
        tlsMDAnderson: ["MD Anderson adult tumor lysis syndrome algorithm", "https://www.mdanderson.org/content/dam/mdanderson/documents/for-physicians/algorithms/clinical-management/clin-management-tumor-lysis-web-algorithm.pdf"],
        tlsEviQ: ["eviQ tumor lysis prevention and rasburicase safety", "https://www.eviq.org.au/clinical-resources/side-effect-and-toxicity-management/prophylaxis-and-treatment/108-prevention-of-tumour-lysis-syndrome"],
        malignancyCalcium: ["Endocrine Society guideline: hypercalcemia of malignancy in adults", "https://www.endocrine.org/clinical-practice-guidelines/hypercalcemia"],
        svcImaging: ["ACR Appropriateness Criteria: suspected superior vena cava syndrome", "https://acsearch.acr.org/docs/3196043/Narrative"],
        svcNHS: ["NHS Ayrshire & Arran: initial management of superior vena cava obstruction", "https://aaamedicines.org.uk/guidelines/respiratory-system/initial-management-of-superior-vena-cava-obstruction/"],
        sitcCell: ["SITC immune effector cell-related adverse events guideline", "https://jitc.bmj.com/content/8/2/e001511"],
        sitcCheckpoint: ["SITC immune checkpoint inhibitor-related adverse events guideline", "https://jitc.bmj.com/content/9/6/e002435"],
        majorTrauma: ["NICE NG39: major trauma assessment and initial management", "https://www.nice.org.uk/guidance/ng39/chapter/recommendations"],
        traumaBleeding: ["European guideline on major bleeding and coagulopathy following trauma (2023)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9977110/"],
        pregnancyTrauma: ["EAST practice management guideline on trauma in pregnancy (2025)", "https://www.east.org/education-resources/practice-management-guidelines/details/trauma-in-pregnancy-a-systematic-review-metaanalysis-and-practice-management-guideline-from-the-east"],
        obstetricBP: ["ACOG Committee Opinion 767: acute severe hypertension in pregnancy and postpartum", "https://pubmed.ncbi.nlm.nih.gov/30575639/"],
        obstetricSevereFeatures: ["ACOG clinician education: hypertensive disorders and severe features", "https://www.acog.org/community/districts-and-sections/district-iv/whats-new/countdown-to-intern-year-week-3-hypertensive-disorders"],
        cardioversionEnergy: ["AHA 2025 adult electrical cardioversion algorithm", "https://cpr.heart.org/en/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Electrical-Cardioversion-250514.pdf"],
        postArrest: ["AHA 2025 adult post-cardiac arrest care", "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/post-cardiac-arrest-care"],
        stormConsensus: ["Joint endocrine society consensus on thyroid storm (2026)", "https://doi.org/10.1530/ETJ-26-0043"],
        myxoedemaConsensus: ["Joint endocrine society consensus on myxoedema coma (2026)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC13452032/"],
        ataThyrotoxicosis: ["ATA hyperthyroidism and thyrotoxicosis guideline (2016)", "https://doi.org/10.1089/thy.2016.0229"],
        ataHypothyroidism: ["ATA hypothyroidism guideline (2014), including myxoedema coma", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4267409/"],
        antepartumExam: ['RCOG Green-top 63 antepartum haemorrhage (2011): foundational examination precautions', 'https://www.rcog.org.uk/media/pwdi1tef/gtg_63.pdf'],
        previaExam: ['RCOG placenta praevia patient information: speculum examination', 'https://www.rcog.org.uk/for-the-public/browse-our-patient-information/placenta-praevia-placenta-accreta-and-vasa-praevia'],
        heavyBleeding: ["NICE NG88 heavy menstrual bleeding: history and selective tests", "https://www.nice.org.uk/guidance/ng88/chapter/Recommendations"],
        endometrialReferral: ["NICE NG12 suspected cancer: postmenopausal bleeding referral", "https://www.nice.org.uk/guidance/ng12/chapter/Recommendations-organised-by-site-of-cancer"],
        chs: ["RCEM suspected cannabinoid hyperemesis best-practice guideline (2024)", "https://rcem.ac.uk/wp-content/uploads/2024/02/RCEM_Cannabinoid_Hyperemesis_Syndrome_v5.0.pdf"],
        alfAssessment: ["AASLD Liver Fellow Network: defining and managing acute liver failure (2025; educational review)", "https://www.aasld.org/liver-fellow-network/core-series/back-basics/defining-and-managing-acute-liver-failure"],
        alfEASL: ["EASL acute liver failure clinical practice guideline (2017): trajectory and referral", "https://easl.eu/wp-content/uploads/2018/10/LiverFailure-English-report.pdf"],
        cholangitis: ["ASGE management of cholangitis guideline (2021)", "https://www.asge.org/home/resources/publications/guidelines/asge-guideline-on-the-management-of-cholangitis"],
        oximetry: ["MHRA pulse oximetry: limitations for healthcare professionals", "https://www.gov.uk/guidance/the-use-and-regulation-of-pulse-oximeters-information-for-healthcare-professionals"],
        coExposure: ["CDC clinical guidance for carbon monoxide poisoning", "https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html"],
        diplopiaAssessment: ["AAO: evaluation and follow-up of diplopia (2022; clinician education)", "https://www.aao.org/young-ophthalmologists/yo-info/article/when-is-diplopia-a-sign-of-something-dangerous"],
        croup: ["CPS acute management of croup in the ED (updated March 2026)", "https://cps.ca/en/documents/position/acute-management-of-croup"],
        dvt: ["NICE NG158 venous thromboembolism: DVT diagnostic pathway", "https://www.nice.org.uk/guidance/ng158/chapter/recommendations"],
        dvtUltrasound: ["ACEP Sonoguide: DVT ultrasound and limitations", "https://www.acep.org/sonoguide/basic/dvt"],
        falls: ["NICE NG249 falls assessment and prevention (2025)", "https://www.nice.org.uk/guidance/ng249/chapter/Recommendations"],
        occultHip: ["NICE CG124 hip fracture: imaging for occult fracture", "https://www.nice.org.uk/guidance/cg124/chapter/Recommendations"],

        gbs: ['EAN/PNS Guillain–Barré syndrome guideline (2023)', 'https://doi.org/10.1111/ene.16073'],
        comaAssessment: ['NCS ENLS coma protocol: foundational bedside assessment (v4, 2019)', 'https://higherlogicdownload.s3.amazonaws.com/NEUROCRITICALCARE/fdc4bb32-6722-417b-8839-f68ac1ef3794/UploadedImages/ENLS_Documents/ENLS_V4.0_protocol%20files/ENLS_V_4_0_Protocol_Coma_FINAL.pdf'],
        ambulatoryECG: ['ISHNE/HRS ambulatory ECG consensus (2017): symptom–rhythm correlation', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6931745/'],
        acuteBP: ['AHA elevated blood pressure in acute care scientific statement (2024)', 'https://www.ahajournals.org/doi/10.1161/HYP.0000000000000238'],
        ich: ['AHA/ASA spontaneous intracerebral hemorrhage guideline (2022)', 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000407'],
        sodiumUS: ['US hyponatremia expert-panel recommendations (2013)', 'https://doi.org/10.1016/j.amjmed.2013.07.006'],
        potassiumKDIGO: ['KDIGO conference: acute hyperkalemia in the ED (2020)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7448835/'],
        burnResuscitation: ['ABA burn-shock resuscitation guideline (2024): adults with ≥20% TBSA burns', 'https://doi.org/10.1093/jbcr/irad125'],
        burnReferral: ['ABA guidelines for burn patient referral', 'https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral'],
        burnCooling: ['ANZCOR 9.1.3: first aid for burns', 'https://www.anzcor.org/home/first-aid/guideline-9-1-3-first-aid-for-burns'],
        rcukAnaphylaxis: ['RCUK emergency treatment of anaphylaxis guideline (2021; referenced in 2025 guidance)', 'https://www.resus.org.uk/sites/default/files/2021-05/Emergency%20Treatment%20of%20Anaphylaxis%20May%202021_0.pdf'],
        wernickeUK: ['UK alcohol treatment guidance: acute hospitals and Wernicke treatment (updated 2026)', 'https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/16-alcohol-care-in-acute-hospitals'],
        chemicalEye: ['AAO EyeWiki: chemical eye injury — initial assessment and irrigation', 'https://eyewiki.aao.org/Chemical_(Alkali_and_Acid)_Injury_of_the_Conjunctiva_and_Cornea'],
        infectiousDiarrhea: ['IDSA infectious diarrhea guideline (2017)', 'https://www.idsociety.org/practice-guideline/infectious-diarrhea/'],
        urethralTrauma: ['AUA urotrauma guideline: suspected urethral injury', 'https://www.auanet.org/documents/Guidelines/PDF/clinical-guidance/Urotrauma.PDF'],
        catheterCare: ['NHS: living with a urinary catheter — care and when to seek help', 'https://www.nhs.uk/tests-and-treatments/urinary-catheters/living-with/'],
        mtbi: ['ACEP adult mild traumatic brain injury clinical policy (2023)', 'https://www.acepnow.com/article/acep-clinical-policy-on-mild-traumatic-brain-injury/?singlepage=1'],
        csfLeak: ['IDSA ventriculitis/meningitis guideline: basilar fracture and CSF leak (2017)', 'https://www.idsociety.org/practice-guideline/healthcare-associated-ventriculitis-and-meningitis/'],
        ectopicDiagnosis: ['NICE NG126: pregnancy of unknown location and diagnostic follow-up', 'https://www.nice.org.uk/guidance/NG126/chapter/diagnosis-of-viable-intrauterine-pregnancy-and-of-tubal-ectopic-pregnancy'],
        firstSeizure: ['NICE NG217: first seizure assessment and selective investigations (updated 2025)', 'https://www.nice.org.uk/guidance/ng217/chapter/diagnosis-and-assessment-of-epilepsy'],
        lgibASGE: ['ASGE acute lower GI bleeding guideline (2026)', 'https://doi.org/10.1016/j.gie.2026.06.046'],
        sah: ['AHA/ASA aneurysmal subarachnoid hemorrhage guideline (2023)', 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000436'],
        delirium: ['NICE CG103 delirium: recognition, assessment and supportive care (updated 2023)', 'https://www.nice.org.uk/guidance/cg103/chapter/Recommendations'],
        syncopeGuideline: ['ACC/AHA/HRS syncope guideline (2017)', 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000499'],
        dyspneaAssessment: ['SAEM CDEM: shortness of breath — initial assessment and respiratory support', 'https://www.saem.org/about-saem/academies-interest-groups-affiliates2/cdem/for-students/online-education/m4-curriculum/group-m4-approach-to/shortness-of-breath'],
        abdominalAssessment: ['SAEM CDEM: approach to abdominal pain — assessment and investigation', 'https://www.saem.org/about-saem/academies-interest-groups-affiliates2/cdem/for-students/online-education/m4-curriculum/group-m4-approach-to/approach-to-abdominal-pain'],
        mesentericEGS: ['Emergency General Surgery Algorithms working group: acute mesenteric ischemia (2025)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12363320/'],
        mesenteric: ['WSES acute mesenteric ischemia guideline (2022)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9580452/'],
        acetaminophen: ['US/Canada acetaminophen poisoning consensus (2023, corrected)', 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2808062'],
        mscc: ['NICE NG234 spinal metastases and cord compression', 'https://www.nice.org.uk/guidance/ng234/chapter/recommendations'],
        aorta: ['ACC/AHA aortic disease guideline (2022), acute aortic syndrome', 'https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004'],
        chest: ['ACC 2022 ED chest-pain pathway', 'https://www.jacc.org/doi/10.1016/j.jacc.2022.08.750'],
        mi: ['Fifth Universal Definition of MI (2026)', 'https://www.jacc.org/doi/full/10.1016/j.jacc.2026.07.025'],
        af: ['ACC/AHA/ACCP/HRS AF guideline (2023)', 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001193'],
        als: ['AHA 2025 Adult Advanced Life Support', 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support'],
        special: ['AHA 2025 special circumstances: resuscitation and poisoning', 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation'],
        pe: ['AHA/ACC multisociety acute PE guideline (2026)', 'https://www.jacc.org/doi/10.1016/j.jacc.2025.11.005'],
        stroke: ['AHA/ASA acute ischemic stroke guideline (2026)', 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000513'],
        dizziness: ['SAEM GRACE-3: acute dizziness (2023)', 'https://www.saem.org/publications/grace/grace-3'],
        headache: ['ACEP adult acute headache policy (2019)', 'https://www.acep.org/siteassets/sites/acep/media/clinical-policies/cp-headache.pdf'],
        dka: ['ADA/EASD and partner societies: adult DKA/HHS consensus (2024)', 'https://doi.org/10.2337/dci24-0032'],
        adrenal: ['Endocrine Society: primary adrenal insufficiency', 'https://www.endocrine.org/clinical-practice-guidelines/primary-adrenal-insufficiency'],
        sepsis: ['Surviving Sepsis Campaign adult guideline (2026)', 'https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026'],
        asthma: ['GINA strategy report (2026)', 'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf'],
        pericarditis: ['ESC myocarditis and pericarditis guideline (2025)', 'https://academic.oup.com/eurheartj/article/46/40/3952/8234483'],
        rh: ['ACOG early pregnancy loss: current RhIg advice', 'https://www.acog.org/womens-health/faqs/early-pregnancy-loss'],
        cdi: ['SHEA/IDSA C. difficile guideline update (2021)', 'https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/'],
        kawasaki: ['AHA Kawasaki disease scientific statement (2024)', 'https://www.ahajournals.org/doi/epdf/10.1161/CIR.0000000000001295'],
        joint: ['EBJIS native-joint septic arthritis guideline (SANJO, 2023)', 'https://jbji.copernicus.org/articles/8/29/2023/jbji-8-29-2023.pdf'],
        pid: ['CDC pelvic inflammatory disease treatment guideline', 'https://www.cdc.gov/std/treatment-guidelines/pid.htm'],
        epididymitis: ['CDC epididymitis treatment guideline', 'https://www.cdc.gov/std/treatment-guidelines/epididymitis.htm'],
        stones: ['EAU urolithiasis: infected obstruction and anuria', 'https://uroweb.org/guidelines/urolithiasis/chapter/guidelines'],
        seizures: ['AES convulsive status epilepticus guideline (2016)', 'https://cms.aesnet.org/clinical-care/clinical-guidance/guideline-prolonged-seizures/guideline-for-treatment-of-prolonged-seizures-in-children-and-adults'],
        esett: ['ESETT randomized trial: status epilepticus second-line doses (2019)', 'https://www.nejm.org/doi/10.1056/NEJMoa1905795'],
        bronchiolitis: ['NICE NG9 bronchiolitis recommendations', 'https://www.nice.org.uk/guidance/ng9/chapter/Recommendations'],
        headinjury: ['NICE NG232 head injury recommendations', 'https://www.nice.org.uk/guidance/NG232/chapter/recommendations'],
        ectopic: ['NICE NG126 management of tubal ectopic pregnancy', 'https://www.nice.org.uk/guidance/NG126/chapter/management-of-tubal-ectopic-pregnancy']
,
        acs: ["ACC/AHA multisociety ACS guideline (2025)", "https://www.jacc.org/doi/10.1016/j.jacc.2024.11.009"],
        appendicitis: ["WSES Jerusalem appendicitis guideline, 2025 edition (published 2026)", "https://jamanetwork.com/journals/jamasurgery/article-abstract/2844195"],
        meningitis: ["NICE NG240 bacterial meningitis: LP safety and antibiotic timing", "https://www.nice.org.uk/guidance/ng240/chapter/Recommendations"],
        syncope: ["Canadian Syncope Risk Score multicentre validation (2020)", "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2763181"],
        ugib: ["ACG upper GI and ulcer bleeding guideline (2021)", "https://pubmed.ncbi.nlm.nih.gov/33929377/"],
        lgib: ["ACG acute lower GI bleeding guideline (2023)", "https://pubmed.ncbi.nlm.nih.gov/36735555/"],
        back: ["NICE NG59 low back pain: activity and analgesia", "https://www.nice.org.uk/guidance/ng59/chapter/Recommendations"],
        keratitis: ["AAO bacterial keratitis Preferred Practice Pattern (2024)", "https://www.aaojournal.org/article/S0161-6420(24)00007-1/fulltext"],
        pph: ["WHO/FIGO/ICM consolidated postpartum haemorrhage guideline (2025)", "https://www.who.int/publications/i/item/9789240115637"],
        gas: ["IDSA GAS pharyngitis risk-assessment update (2025)", "https://www.idsociety.org/practice-guideline/streptococcal-pharyngitis2/"],
        gasTesting: ["CDC GAS pharyngitis testing guidance", "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html"],
        hemoptysis: ["CIRSE bronchial artery embolisation standards (2022)", "https://pubmed.ncbi.nlm.nih.gov/35396612/"],
        hyperemesis: ["RCOG Green-top 69 nausea/vomiting and hyperemesis (2024)", "https://doi.org/10.1111/1471-0528.17739"],
        infant: ["AAP well-appearing febrile infants 8–60 days (2021)", "https://publications.aap.org/pediatrics/article/148/2/e2021052228/179783"],
        infant90: ["CPS febrile infants ≤90 days (updated April 2026)", "https://cps.ca/en/documents/position/management-of-well-appearing-febrile-young-infants-aged-90-days"],
        childFever: ["NICE NG143 fever under 5: clinical assessment", "https://www.nice.org.uk/guidance/NG143/chapter/recommendations"],
        selfharm: ["NICE NG225 self-harm: assessment and limits of risk scores (2022)", "https://www.nice.org.uk/guidance/ng225/chapter/recommendations"],
        cn3: ["Isolated third-nerve palsies: modern management principles (Eye, 2022)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8727561/"],
        constipation: ["ASCRS chronic constipation guideline (2024)", "https://www.unboundmedicine.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982011/all/Evaluation_and_Management_of_Chronic_Constipation__2024_"],
        pad: ["ACC/AHA multisociety lower-extremity PAD guideline (2024)", "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001251"],
        ssti: ["IDSA skin and soft-tissue infections guideline (2014)", "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/"],
        methb: ["EHA/EuroBloodNet methemoglobinemia recommendations (2021)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9291883/"],
        lung: ["ACEP Sonoguide: lung ultrasound and diagnostic limitations", "https://www.acep.org/sonoguide/basic/lung/"],
        neonate: ["CPS detection of critical congenital heart disease", "https://cps.ca/en/documents/position/pulse-oximetry-screening"],
        acls: ["AHA 2025 adult advanced cardiovascular life support algorithm", "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support"],
        hyperkalemia: ['UK Kidney Association adult hyperkalemia guideline (updated July 2026)', 'https://guidelines.ukkidney.org/hyperkalaemia/6-summary-of-clinical-practice-guideline-for-hyperkalaemia/6-2-section-ii-hospital/'],
        hyponatremia: ["European hyponatraemia clinical practice guideline", "https://academic.oup.com/ejendo/article/170/3/G1/6656231"],
        tbi: ["NICE NG232 head injury: assessment and early management", "https://www.nice.org.uk/guidance/NG232/chapter/recommendations"],
        hypertension: ["ESH 2023 arterial hypertension guideline", "https://journals.lww.com/jhypertension/fulltext/2023/06000/2023_esh_guidelines_for_the_management_of.2.aspx"],
        burns: ["American Burn Association burn-shock resuscitation guidelines", "https://ameriburn.org/quality-care/clinical-guidelines/"],
        withdrawal: ["ASAM clinical practice guideline on alcohol withdrawal management (2020)", "https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal"],
    };
    const topics = {
        'acute-ischemic-stroke': ['stroke'],
        'transient-ischemic-attack': ['tiaAHA', 'stroke'],
        'aneurysmal-subarachnoid-hemorrhage': ['sah', 'headache'],
        'spontaneous-intracerebral-hemorrhage': ['ich', 'ichESO'],
        'acute-bacterial-meningitis': ['meningitis', 'meningitisWHO'],
        'convulsive-status-epilepticus': ['seizures', 'esett', 'statusAdult'],
        'cerebral-venous-thrombosis': ['cvtAHA', 'cvtCanada'],
        'acute-heart-failure': ['acuteHF2026', 'hfESC'],
        'acute-asthma-exacerbation': ['asthma', 'dyspneaAssessment'],
        'copd-exacerbation': ['goldCOPD', 'copdOxygen'],
        'community-acquired-pneumonia': ['capATS', 'capIDSA', 'sepsis'],
        'sepsis-and-septic-shock': ['sepsis'],
        'cardiogenic-shock': ['cardiogenicACC', 'acuteHF2026', 'acs'],
        'adrenal-crisis': ['adrenalNICE', 'adrenal', 'adrenalESE'],
        'ectopic-pregnancy': ['ectopicDiagnosis', 'ectopic', 'acepEarlyPregnancy'],
        'ovarian-torsion': ['adnexalTorsion', 'acutePelvicImaging'],
        'testicular-torsion': ['acuteScrotumAUA', 'acuteScrotumEAU'],
        'perforated-peptic-ulcer': ['perforatedUlcer', 'surgicalSourceControl'],
        'acute-cholecystitis': ['cholecystitisWSES', 'cholecystitisEAST'],
        'acute-cholangitis': ['cholangitis', 'sepsis'],
        'acute-pancreatitis': ['pancreatitisACG', 'pancreatitisIAP'],
        'acute-diverticulitis': ['diverticulitisACG', 'diverticulitisIDSA', 'diverticulitisNICE'],
        'acute-coronary-syndrome': ['acs', 'chest', 'mi'],
        'acute-aortic-syndrome': ['aorta'],
        'pulmonary-embolism': ['pe'],
        'tension-pneumothorax': ['majorTrauma', 'ercSpecial', 'lung'],
        'esophageal-perforation': ['esophagealPerforation'],
        'cardiac-tamponade': ['pericarditis', 'ercSpecial', 'aorta'],
        'acute-mesenteric-ischemia': ['mesenteric', 'mesentericESVS', 'mesentericEGS'],
        'ruptured-abdominal-aortic-aneurysm': ['aaaESVS'],
        'acute-appendicitis': ['appendicitis'],
        'small-bowel-obstruction': ['sboBologna', 'sboEGS'],

        'neutropenic-sepsis': ['neutropenicNICE', 'neutropenicASCO', 'oncologyGI'],
        'tumor-lysis-syndrome': ['tlsBSH', 'tlsMDAnderson', 'tlsEviQ'],
        'metastatic-spinal-cord-compression': ['mscc'],
        'hypercalcemia-of-malignancy': ['malignancyCalcium', 'acuteOncology'],
        'superior-vena-cava-syndrome': ['svcImaging', 'svcNHS'],
        'cancer-immunotherapy-toxicity': ['sitcCell', 'sitcCheckpoint'],
        'chest-pain': ['aorta', 'chest', 'acs', 'mi', 'pe'], dyspnea: ['asthma', 'pe', 'dyspneaAssessment'],
        headache: ['headache', 'sah', 'stroke'], ams: ['stroke', 'special', 'meningitis', 'delirium'], coma: ['stroke', 'special', 'comaAssessment'],
        weakness: ['stroke', 'gbs'], dizziness: ['dizziness', 'stroke'], diplopia: ['cn3', 'stroke', 'diplopiaAssessment'],
        'focal-neurologic-deficit': ['stroke', 'ich'], fever: ['sepsis', 'meningitis'], shock: ['sepsis', 'lung', 'special'],
        'joint-pain': ['joint'], 'pelvic-pain': ['ectopic', 'ectopicDiagnosis', 'pid'], 'abdominal-pain': ['appendicitis', 'ectopic', 'abdominalAssessment', 'mesenteric'],
        'vaginal-bleeding': ['pph', 'rh', 'ectopic', 'heavyBleeding', 'endometrialReferral', 'antepartumExam', 'previaExam'], 'pregnancy-emergency': ['special', 'pe', 'rh', 'hyperemesis', 'pph', 'obstetricBP', 'obstetricSevereFeatures', 'ectopicDiagnosis', 'pregnancyTrauma'],
        'scrotal-pain': ['epididymitis'], seizures: ['seizures', 'esett', 'firstSeizure'], hemoptysis: ['hemoptysis', 'pe'],
        'nausea-vomiting': ['hyperemesis', 'dka', 'adrenal', 'chest', 'chs'], diarrhea: ['cdi', 'infectiousDiarrhea'], cyanosis: ['methb', 'neonate', 'special', 'oximetry', 'coExposure'],
        overdose: ['special', 'acetaminophen', 'selfharm', 'acmtNAC', 'snapNAC'], jaundice: ['acetaminophen', 'alfAssessment', 'alfEASL', 'cholangitis'], 'back-pain': ['mscc', 'back'], 'pediatric-fever': ['infant', 'infant90', 'childFever', 'kawasaki', 'meningitis'], hyperglycemia: ['dka', 'adrenal', 'hillierSodium'],
        'heat-cold': ['special'], palpitations: ['af', 'als', 'ambulatoryECG'], syncope: ['syncope', 'syncopeGuideline', 'als'],
        'airway-stridor': ['special', 'croup', 'intubationACEP', 'intubationTrial'], anaphylaxis: ['special', 'rcukAnaphylaxis', 'waoAnaphylaxis', 'jtfppAnaphylaxis'], 'flank-pain': ['stones'],
        'urinary-retention': ['stones', 'urethralTrauma', 'catheterCare'], edema: ['pe', 'dvt', 'dvtUltrasound'], 'multiple-trauma': ['headinjury', 'majorTrauma', 'traumaBleeding'],
        'falls-geriatric-trauma': ['headinjury', 'falls', 'occultHip'], 'pediatric-respiratory-distress': ['bronchiolitis', 'asthma'],
        gib: ['ugib', 'lgib', 'lgibASGE'], 'red-eye': ['keratitis', 'chemicalEye'], 'sore-throat': ['gas', 'gasTesting'],
        suicidal: ['selfharm'], constipation: ['constipation'], 'limb-ischemia': ['pad'], rash: ['ssti'],
        'cardiac-arrest': ['acls', 'als', 'special', 'cardioversionEnergy', 'postArrest'], electrolytes: ['hyperkalemia', 'hyponatremia', 'sodiumUS', 'potassiumKDIGO'],
        'head-injury': ['tbi', 'headinjury', 'mtbi', 'csfLeak', 'cchr', 'pecarn', 'intubationACEP', 'intubationTrial'], 'hypertensive-emergency': ['hypertension', 'stroke', 'acuteBP', 'aorta', 'ich'],
        burns: ['burns', 'burnResuscitation', 'burnReferral', 'burnCooling', 'special'], 'alcohol-withdrawal': ['withdrawal', 'wernickeUK'], 'thyroid-storm': ['stormConsensus', 'myxoedemaConsensus', 'ataThyrotoxicosis', 'ataHypothyroidism'],
        ecg: ['mi', 'af', 'als', 'special', 'pericarditis']
    };
    const topicReviews = {
    "chest-pain": {
        "checked": "2026-11-10",
        "scope": "symptom assessment, previous testing and discharge follow-up",
        "sources": [
            "chest"
        ]
    },
    "dyspnea": {
        "checked": "2026-11-10",
        "scope": "initial assessment, ventilation and reassessment",
        "sources": [
            "dyspneaAssessment"
        ]
    },
    "abdominal-pain": {
        "checked": "2026-11-10",
        "scope": "targeted testing, serial assessment and mesenteric CTA",
        "sources": [
            "abdominalAssessment",
            "mesenteric"
        ]
    },
    "headache": {
        "checked": "2026-11-10",
        "scope": "onset history, test limitations and LP versus CTA",
        "sources": [
            "headache",
            "sah"
        ]
    },
    "ams": {
        "checked": "2026-11-10",
        "scope": "delirium recognition, assessment and supportive care",
        "sources": [
            "delirium"
        ]
    },
    "syncope": {
        "checked": "2026-11-10",
        "scope": "witness history, selective testing and rhythm monitoring",
        "sources": [
            "syncopeGuideline"
        ]
    },
    "fever": {
        "checked": "2026-11-10",
        "scope": "perfusion reassessment, source control and antimicrobial review",
        "sources": [
            "sepsis"
        ]
    },
    "dizziness": {
        "checked": "2026-11-10",
        "scope": "timing and triggers, focused examination and selective imaging",
        "sources": [
            "dizziness"
        ]
    },
    "gib": {
        "checked": "2026-11-10",
        "scope": "bleeding severity, selective CTA and colonoscopy timing",
        "sources": [
            "ugib",
            "lgib",
            "lgibASGE"
        ]
    },
    "back-pain": {
        "checked": "2026-11-10",
        "scope": "changing symptoms, selective imaging and MSCC escalation",
        "sources": [
            "back",
            "mscc"
        ]
    },
    "joint-pain": {
        "checked": "2026-11-10",
        "scope": "aspiration priorities, test limitations and treatment response",
        "sources": [
            "joint"
        ]
    },
    "pelvic-pain": {
        "checked": "2026-11-10",
        "scope": "pregnancy of unknown location, serial assessment and follow-up",
        "sources": [
            "ectopicDiagnosis"
        ]
    },
    "seizures": {
        "checked": "2026-11-10",
        "scope": "witness history, selective investigations and first-seizure follow-up",
        "sources": [
            "firstSeizure"
        ]
    },
    "overdose": {
        "checked": "2026-11-10",
        "scope": "acetaminophen treatment and stopping criteria, opioid aftercare, and sodium-channel blockade reassessment",
        "sources": [
            "special",
            "selfharm",
            "acmtNAC",
            "snapNAC"
        ]
    },
    "hyperglycemia": {
        "checked": "2026-11-10",
        "scope": "adult hyperglycemic crises, insulin transition and osmolality calculation",
        "sources": [
            "dka",
            "hillierSodium"
        ]
    },
    "flank-pain": {
        "checked": "2026-11-10",
        "scope": "urgent evaluation, passage confirmation and observation limits",
        "sources": [
            "stones"
        ]
    },
    "red-eye": {
        "checked": "2026-11-10",
        "scope": "chemical exposure, pH reassessment and keratitis test limitations",
        "sources": [
            "chemicalEye",
            "keratitis"
        ]
    },
    "sore-throat": {
        "checked": "2026-11-10",
        "scope": "selective GAS testing, result follow-up and transmission advice",
        "sources": [
            "gasTesting"
        ]
    },
    "scrotal-pain": {
        "checked": "2026-11-10",
        "scope": "epididymitis testing, reassessment and STI aftercare",
        "sources": [
            "epididymitis"
        ]
    },
    "diarrhea": {
        "checked": "2026-11-10",
        "scope": "selective stool tests, rehydration and persistent symptoms",
        "sources": [
            "infectiousDiarrhea"
        ]
    },
    "rash": {
        "checked": "2026-11-10",
        "scope": "cellulitis/abscess assessment, culture selection and recurrence prevention",
        "sources": [
            "ssti"
        ]
    },
    "limb-ischemia": {
        "checked": "2026-11-10",
        "scope": "timed limb assessment, treatment priority and reperfusion monitoring",
        "sources": [
            "pad"
        ]
    },
    "urinary-retention": {
        "checked": "2026-11-10",
        "scope": "urethral trauma precautions and catheter discharge care",
        "sources": [
            "urethralTrauma",
            "catheterCare"
        ]
    },
    "head-injury": {
        "checked": "2026-11-10",
        "scope": "adult minor head injury, imaging rule scope, and emergency intubation precautions",
        "sources": [
            "tbi",
            "mtbi",
            "csfLeak",
            "cchr",
            "pecarn",
            "intubationACEP",
            "intubationTrial"
        ]
    },
    "pediatric-fever": {
        "checked": "2026-11-10",
        "scope": "caregiver history, return advice, antipyretics and LP safety",
        "sources": [
            "childFever",
            "infant90",
            "meningitis"
        ]
    },
    "pediatric-respiratory-distress": {
        "checked": "2026-11-10",
        "scope": "selected bronchiolitis suction and age-specific discharge criteria",
        "sources": [
            "bronchiolitis"
        ]
    },
    "anaphylaxis": {
        "checked": "2026-11-10",
        "scope": "recognition, IM epinephrine, positioning, refractory care and discharge teaching",
        "sources": [
            "rcukAnaphylaxis",
            "waoAnaphylaxis",
            "jtfppAnaphylaxis"
        ]
    },
    "burns": {
        "checked": "2026-11-10",
        "scope": "cooling/referral, airway indications and adult starting-fluid calculation",
        "sources": [
            "burnResuscitation",
            "burnReferral",
            "burnCooling"
        ]
    },
    "heat-cold": {
        "checked": "2026-11-10",
        "scope": "parallel resuscitation, temperature monitoring and rewarming support",
        "sources": [
            "special"
        ]
    },
    "alcohol-withdrawal": {
        "checked": "2026-11-10",
        "scope": "glucose timing, assessment limitations and selected thiamine regimens",
        "sources": [
            "withdrawal",
            "wernickeUK"
        ]
    },
    "suicidal": {
        "checked": "2026-11-10",
        "scope": "concurrent assessment, collaborative safety plans and aftercare",
        "sources": [
            "selfharm"
        ]
    },
    "constipation": {
        "checked": "2026-11-10",
        "scope": "outlet symptoms, selective colonoscopy and ongoing care",
        "sources": [
            "constipation"
        ]
    },
    "weakness": {
        "checked": "2026-11-10",
        "scope": "selected GBS respiratory/autonomic assessment and early test limitations",
        "sources": [
            "gbs"
        ]
    },
    "coma": {
        "checked": "2026-11-10",
        "scope": "foundational reassessment, diagnostic uncertainty and directed investigations",
        "sources": [
            "comaAssessment",
            "stroke"
        ]
    },
    "hemoptysis": {
        "checked": "2026-11-10",
        "scope": "bleeding-specific imaging, airway priorities and follow-up",
        "sources": [
            "hemoptysis"
        ]
    },
    "shock": {
        "checked": "2026-11-10",
        "scope": "selected septic-shock reassessment, fluids and vasopressor access",
        "sources": [
            "sepsis"
        ]
    },
    "palpitations": {
        "checked": "2026-11-10",
        "scope": "symptom-linked monitoring and selective rhythm assessment",
        "sources": [
            "ambulatoryECG",
            "als"
        ]
    },
    "focal-neurologic-deficit": {
        "checked": "2026-11-10",
        "scope": "selected stroke escalation, post-EVT BP and ICH target scope",
        "sources": [
            "stroke",
            "ich"
        ]
    },
    "electrolytes": {
        "checked": "2026-11-10",
        "scope": "selected potassium treatment/monitoring and hyponatremia safety limits",
        "sources": [
            "hyperkalemia",
            "potassiumKDIGO",
            "sodiumUS"
        ]
    },
    "hypertensive-emergency": {
        "checked": "2026-11-10",
        "scope": "acute organ injury, cause-specific targets and aortic/ICH scope",
        "sources": [
            "acuteBP",
            "aorta",
            "ich"
        ]
    },
    "vaginal-bleeding": {
        "checked": "2026-11-10",
        "scope": "selected bleeding assessment, selective tests, referral and examination precautions",
        "sources": [
            "heavyBleeding",
            "endometrialReferral",
            "antepartumExam",
            "previaExam"
        ]
    },
    "nausea-vomiting": {
        "checked": "2026-11-10",
        "scope": "selected suspected CHS assessment, treatment precautions and prevention",
        "sources": [
            "chs"
        ]
    },
    "jaundice": {
        "checked": "2026-11-10",
        "scope": "selected acute liver failure trajectory and staged cholangitis source control",
        "sources": [
            "alfAssessment",
            "alfEASL",
            "cholangitis"
        ]
    },
    "cyanosis": {
        "checked": "2026-11-10",
        "scope": "selected oximetry limitations and CO exposure/test interpretation",
        "sources": [
            "oximetry",
            "coExposure"
        ]
    },
    "diplopia": {
        "checked": "2026-11-10",
        "scope": "selected symptom evolution, associated findings and follow-up",
        "sources": [
            "diplopiaAssessment"
        ]
    },
    "airway-stridor": {
        "checked": "2026-11-10",
        "scope": "selected croup recognition and observation, and emergency intubation precautions",
        "sources": [
            "croup",
            "intubationACEP",
            "intubationTrial"
        ]
    },
    "edema": {
        "checked": "2026-11-10",
        "scope": "selected DVT probability, ultrasound limits and follow-up pathway",
        "sources": [
            "dvt",
            "dvtUltrasound"
        ]
    },
    "falls-geriatric-trauma": {
        "checked": "2026-11-10",
        "scope": "selected multifactorial falls assessment and occult hip imaging",
        "sources": [
            "falls",
            "occultHip"
        ]
    },
    "multiple-trauma": {
        "checked": "2026-11-13",
        "scope": "selected hemorrhage resuscitation, eFAST limitations and CT decisions",
        "sources": [
            "majorTrauma",
            "traumaBleeding"
        ]
    },
    "pregnancy-emergency": {
        "checked": "2026-11-13",
        "scope": "selected severe hypertension, early pregnancy follow-up, trauma observation and maternal resuscitation",
        "sources": [
            "obstetricBP",
            "obstetricSevereFeatures",
            "ectopicDiagnosis",
            "pregnancyTrauma",
            "special"
        ]
    },
    "cardiac-arrest": {
        "checked": "2026-11-13",
        "scope": "selected rhythm-specific shocks, reversible causes and adult post-arrest care",
        "sources": [
            "als",
            "special",
            "cardioversionEnergy",
            "postArrest"
        ]
    },
    "thyroid-storm": {
        "checked": "2026-11-13",
        "scope": "selected diagnostic limitations, beta blockade precautions and thyroid hormone replacement",
        "sources": [
            "stormConsensus",
            "myxoedemaConsensus",
            "ataThyrotoxicosis",
            "ataHypothyroidism"
        ]
    },
    "neutropenic-sepsis": {
        "checked": "2026-11-13",
        "scope": "adult recognition, immediate empiric treatment and disposition",
        "sources": [
            "neutropenicNICE",
            "neutropenicASCO",
            "oncologyGI"
        ]
    },
    "tumor-lysis-syndrome": {
        "checked": "2026-11-13",
        "scope": "adult recognition, electrolyte monitoring and rasburicase precautions",
        "sources": [
            "tlsBSH",
            "tlsMDAnderson",
            "tlsEviQ"
        ]
    },
    "metastatic-spinal-cord-compression": {
        "checked": "2026-11-13",
        "scope": "neurological red flags, urgent imaging and dexamethasone",
        "sources": [
            "mscc"
        ]
    },
    "hypercalcemia-of-malignancy": {
        "checked": "2026-11-13",
        "scope": "adult evaluation, initial treatment and monitoring",
        "sources": [
            "malignancyCalcium",
            "acuteOncology"
        ]
    },
    "superior-vena-cava-syndrome": {
        "checked": "2026-11-13",
        "scope": "adult airway assessment, imaging and urgent escalation",
        "sources": [
            "svcImaging",
            "svcNHS"
        ]
    },
    "cancer-immunotherapy-toxicity": {
        "checked": "2026-11-13",
        "scope": "adult CAR-T and immune checkpoint inhibitor toxicity recognition",
        "sources": [
            "sitcCell",
            "sitcCheckpoint"
        ]
    },
    "acute-coronary-syndrome": {
        "checked": "2026-11-13",
        "scope": "adult ECG and reperfusion triage, initial aspirin and high-sensitivity troponin pathways",
        "sources": [
            "acs",
            "chest",
            "mi"
        ]
    },
    "acute-aortic-syndrome": {
        "checked": "2026-11-13",
        "scope": "adult aortic imaging, anti-impulse therapy and emergency surgical escalation",
        "sources": [
            "aorta"
        ]
    },
    "pulmonary-embolism": {
        "checked": "2026-11-13",
        "scope": "adult probability-based testing, severity assessment and initial treatment",
        "sources": [
            "pe"
        ]
    },
    "tension-pneumothorax": {
        "checked": "2026-11-13",
        "scope": "adult recognition of tension physiology, emergency decompression and reassessment",
        "sources": [
            "majorTrauma",
            "ercSpecial",
            "lung"
        ]
    },
    "esophageal-perforation": {
        "checked": "2026-11-13",
        "scope": "adult leak recognition, CT, empiric antibiotics and source-control escalation",
        "sources": [
            "esophagealPerforation"
        ]
    },
    "cardiac-tamponade": {
        "checked": "2026-11-13",
        "scope": "adult bedside hemodynamics, echocardiography and cause-specific drainage",
        "sources": [
            "pericarditis",
            "ercSpecial",
            "aorta"
        ]
    },
    "acute-mesenteric-ischemia": {
        "checked": "2026-11-13",
        "scope": "adult urgent multiphase CTA, initial resuscitation and mechanism-specific escalation",
        "sources": [
            "mesenteric",
            "mesentericESVS",
            "mesentericEGS"
        ]
    },
    "ruptured-abdominal-aortic-aneurysm": {
        "checked": "2026-11-13",
        "scope": "adult rupture recognition, aortic imaging, hemorrhage resuscitation and transfer",
        "sources": [
            "aaaESVS"
        ]
    },
    "acute-appendicitis": {
        "checked": "2026-11-13",
        "scope": "adult risk-guided imaging, complicated disease and treatment options",
        "sources": [
            "appendicitis"
        ]
    },
    "small-bowel-obstruction": {
        "checked": "2026-11-13",
        "scope": "adult CT, indications for urgent surgery and selection for adhesive SBO observation",
        "sources": [
            "sboBologna",
            "sboEGS"
        ]
    },
    "ectopic-pregnancy": {
        "checked": "2026-11-14",
        "scope": "early-pregnancy ultrasound, rupture, pregnancy of unknown location and follow-up",
        "sources": [
            "ectopicDiagnosis",
            "ectopic",
            "acepEarlyPregnancy"
        ]
    },
    "ovarian-torsion": {
        "checked": "2026-11-14",
        "scope": "adolescent and reproductive-age recognition, Doppler limitations and surgical escalation",
        "sources": [
            "adnexalTorsion",
            "acutePelvicImaging"
        ]
    },
    "testicular-torsion": {
        "checked": "2026-11-14",
        "scope": "acute scrotal assessment, Doppler limitations and urgent exploration",
        "sources": [
            "acuteScrotumAUA",
            "acuteScrotumEAU"
        ]
    },
    "perforated-peptic-ulcer": {
        "checked": "2026-11-14",
        "scope": "adult CT, initial antimicrobial therapy and emergency source control",
        "sources": [
            "perforatedUlcer",
            "surgicalSourceControl"
        ]
    },
    "acute-cholecystitis": {
        "checked": "2026-11-14",
        "scope": "adult ultrasound, early surgery and high-risk source-control decisions",
        "sources": [
            "cholecystitisWSES",
            "cholecystitisEAST"
        ]
    },
    "acute-cholangitis": {
        "checked": "2026-11-14",
        "scope": "adult recognition, sepsis resuscitation and severity-based biliary drainage",
        "sources": [
            "cholangitis",
            "sepsis"
        ]
    },
    "acute-pancreatitis": {
        "checked": "2026-11-14",
        "scope": "adult diagnosis, early fluids and feeding, severity reassessment and biliary intervention",
        "sources": [
            "pancreatitisACG",
            "pancreatitisIAP"
        ]
    },
    "acute-diverticulitis": {
        "checked": "2026-11-14",
        "scope": "adult CT, selective antibiotics, complications and disposition",
        "sources": [
            "diverticulitisACG",
            "diverticulitisIDSA",
            "diverticulitisNICE"
        ]
    },
    "acute-heart-failure": {
        "checked": "2026-11-14",
        "scope": "adult emergency assessment, ventilatory support, decongestion and escalation",
        "sources": [
            "acuteHF2026",
            "hfESC"
        ]
    },
    "acute-asthma-exacerbation": {
        "checked": "2026-11-14",
        "scope": "adult acute asthma severity, GINA 2026 treatment and discharge",
        "sources": [
            "asthma",
            "dyspneaAssessment"
        ]
    },
    "copd-exacerbation": {
        "checked": "2026-11-14",
        "scope": "adult controlled oxygen, bronchodilators, antibiotics and noninvasive ventilation",
        "sources": [
            "goldCOPD",
            "copdOxygen"
        ]
    },
    "community-acquired-pneumonia": {
        "checked": "2026-11-14",
        "scope": "adult imaging, initial antimicrobial decisions and severity-based disposition",
        "sources": [
            "capATS",
            "capIDSA",
            "sepsis"
        ]
    },
    "sepsis-and-septic-shock": {
        "checked": "2026-11-14",
        "scope": "adult recognition, antibiotic timing, initial fluids, norepinephrine and source control",
        "sources": [
            "sepsis"
        ]
    },
    "cardiogenic-shock": {
        "checked": "2026-11-14",
        "scope": "adult early recognition, bedside phenotyping and cause-directed escalation",
        "sources": [
            "cardiogenicACC",
            "acuteHF2026",
            "acs"
        ]
    },
    "adrenal-crisis": {
        "checked": "2026-11-14",
        "scope": "adult recognition, immediate hydrocortisone, fluid support and monitoring",
        "sources": [
            "adrenalNICE",
            "adrenal",
            "adrenalESE"
        ]
    },
    "acute-ischemic-stroke": {
        "checked": "2026-11-14",
        "scope": "adult stroke activation, imaging, reperfusion eligibility and early care",
        "sources": [
            "stroke"
        ]
    },
    "transient-ischemic-attack": {
        "checked": "2026-11-14",
        "scope": "adult transient focal symptoms, brain and vascular imaging, prevention and disposition",
        "sources": [
            "tiaAHA",
            "stroke"
        ]
    },
    "aneurysmal-subarachnoid-hemorrhage": {
        "checked": "2026-11-14",
        "scope": "adult nontraumatic thunderclap workup, CT and LP limitations, early specialist care",
        "sources": [
            "sah",
            "headache"
        ]
    },
    "spontaneous-intracerebral-hemorrhage": {
        "checked": "2026-11-14",
        "scope": "adult spontaneous ICH imaging, BP, anticoagulant reversal and neurosurgical escalation",
        "sources": [
            "ich",
            "ichESO"
        ]
    },
    "acute-bacterial-meningitis": {
        "checked": "2026-11-14",
        "scope": "adult recognition, safe LP sequencing, empiric treatment and isolation",
        "sources": [
            "meningitis",
            "meningitisWHO"
        ]
    },
    "convulsive-status-epilepticus": {
        "checked": "2026-11-14",
        "scope": "adult time-based emergency treatment, second-line therapy and EEG escalation",
        "sources": [
            "seizures",
            "esett",
            "statusAdult"
        ]
    },
    "cerebral-venous-thrombosis": {
        "checked": "2026-11-14",
        "scope": "adult recognition, venous imaging, anticoagulation and escalation",
        "sources": [
            "cvtAHA",
            "cvtCanada"
        ]
    }
};
    Object.keys(topicReviews).forEach(function (id) {
        Object.freeze(topicReviews[id].sources);
        Object.freeze(topicReviews[id]);
    });
    window.CLINICAL_EVIDENCE = Object.freeze({ checked: '2026-10-08', sources: sources, topics: topics, topicReviews: Object.freeze(topicReviews) });
}());
