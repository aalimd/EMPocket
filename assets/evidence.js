/* Selected primary guidance for the teaching points reviewed 8 October 2026.
 * Targeted presentation additions checked 10 November 2026; topicReviews records scope.
 * Links support specific topics, not certification of every statement on a page.
 * Keep titles/URLs explicit: no guessed links generated from citation text.
 */
(function () {
    'use strict';
    const sources = {
        sah: ['AHA/ASA aneurysmal subarachnoid hemorrhage guideline (2023)', 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000436'],
        delirium: ['NICE CG103 delirium: recognition, assessment and supportive care (updated 2023)', 'https://www.nice.org.uk/guidance/cg103/chapter/Recommendations'],
        syncopeGuideline: ['ACC/AHA/HRS syncope guideline (2017)', 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000499'],
        dyspneaAssessment: ['SAEM CDEM: shortness of breath — initial assessment and respiratory support', 'https://www.saem.org/about-saem/academies-interest-groups-affiliates2/cdem/for-students/online-education/m4-curriculum/group-m4-approach-to/shortness-of-breath'],
        abdominalAssessment: ['SAEM CDEM: approach to abdominal pain — assessment and investigation', 'https://www.saem.org/about-saem/academies-interest-groups-affiliates2/cdem/for-students/online-education/m4-curriculum/group-m4-approach-to/approach-to-abdominal-pain'],
        mesenteric: ['WSES acute mesenteric ischemia guideline (2022)', 'https://wjes.biomedcentral.com/articles/10.1186/s13017-022-00443-x'],
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
        constipation: ["ASCRS chronic constipation guideline (2024)", "https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851100/all/Evaluation_and_Management_of_Chronic_Constipation__2024_"],
        pad: ["ACC/AHA multisociety lower-extremity PAD guideline (2024)", "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001251"],
        ssti: ["IDSA skin and soft-tissue infections guideline (2014)", "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/"],
        methb: ["EHA/EuroBloodNet methemoglobinemia recommendations (2021)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9291883/"],
        lung: ["ACEP Sonoguide: lung ultrasound and diagnostic limitations", "https://www.acep.org/sonoguide/basic/lung/"],
        neonate: ["CPS detection of critical congenital heart disease", "https://cps.ca/en/documents/position/pulse-oximetry-screening"],
        acls: ["AHA 2025 adult advanced cardiovascular life support algorithm", "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support"],
        hyperkalemia: ["UK Kidney Association hyperkalaemia guideline (2023)", "https://ukkidney.org/health-professionals/guidelines/treatment-acute-hyperkalaemia-adults"],
        hyponatremia: ["European hyponatraemia clinical practice guideline", "https://academic.oup.com/ejendo/article/170/3/G1/6656231"],
        tbi: ["NICE NG232 head injury: assessment and early management", "https://www.nice.org.uk/guidance/NG232/chapter/recommendations"],
        hypertension: ["ESH 2023 arterial hypertension guideline", "https://journals.lww.com/jhypertension/fulltext/2023/06000/2023_esh_guidelines_for_the_management_of.2.aspx"],
        burns: ["American Burn Association burn-shock resuscitation guidelines", "https://ameriburn.org/quality-care/clinical-guidelines/"],
        withdrawal: ["ASAM clinical practice guideline on alcohol withdrawal management (2020)", "https://www.asam.org/quality-care/clinical-guidelines/alcohol-withdrawal"],
        thyroid: ["ATA/AACE thyroid storm and myxoedema emergency guidance", "https://www.thyroid.org/thyroid-storm/"]
    };
    const topics = {
        'chest-pain': ['aorta', 'chest', 'acs', 'mi', 'pe'], dyspnea: ['asthma', 'pe', 'dyspneaAssessment'],
        headache: ['headache', 'sah', 'stroke'], ams: ['stroke', 'special', 'meningitis', 'delirium'], coma: ['stroke', 'special'],
        weakness: ['stroke'], dizziness: ['dizziness', 'stroke'], diplopia: ['cn3', 'stroke'],
        'focal-neurologic-deficit': ['stroke'], fever: ['sepsis', 'meningitis'], shock: ['sepsis', 'lung', 'special'],
        'joint-pain': ['joint'], 'pelvic-pain': ['ectopic', 'pid'], 'abdominal-pain': ['appendicitis', 'ectopic', 'abdominalAssessment', 'mesenteric'],
        'vaginal-bleeding': ['pph', 'rh', 'ectopic'], 'pregnancy-emergency': ['special', 'pe', 'rh', 'hyperemesis', 'pph'],
        'scrotal-pain': ['epididymitis'], seizures: ['seizures', 'esett'], hemoptysis: ['hemoptysis', 'pe'],
        'nausea-vomiting': ['hyperemesis', 'dka', 'adrenal', 'chest'], diarrhea: ['cdi'], cyanosis: ['methb', 'neonate', 'special'],
        overdose: ['special', 'acetaminophen'], jaundice: ['acetaminophen'], 'back-pain': ['mscc', 'back'], 'pediatric-fever': ['infant', 'infant90', 'childFever', 'kawasaki'], hyperglycemia: ['dka', 'adrenal'],
        'heat-cold': ['special'], palpitations: ['af', 'als'], syncope: ['syncope', 'syncopeGuideline', 'als'],
        'airway-stridor': ['special'], anaphylaxis: ['special'], 'flank-pain': ['stones'],
        'urinary-retention': ['stones'], edema: ['pe'], 'multiple-trauma': ['headinjury'],
        'falls-geriatric-trauma': ['headinjury'], 'pediatric-respiratory-distress': ['bronchiolitis', 'asthma'],
        gib: ['ugib', 'lgib'], 'red-eye': ['keratitis'], 'sore-throat': ['gas', 'gasTesting'],
        suicidal: ['selfharm'], constipation: ['constipation'], 'limb-ischemia': ['pad'], rash: ['ssti'],
        'cardiac-arrest': ['acls', 'als', 'special'], electrolytes: ['hyperkalemia', 'hyponatremia'],
        'head-injury': ['tbi', 'headinjury'], 'hypertensive-emergency': ['hypertension', 'stroke'],
        burns: ['burns', 'special'], 'alcohol-withdrawal': ['withdrawal'], 'thyroid-storm': ['thyroid'],
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
    }
};
    Object.keys(topicReviews).forEach(function (id) {
        Object.freeze(topicReviews[id].sources);
        Object.freeze(topicReviews[id]);
    });
    window.CLINICAL_EVIDENCE = Object.freeze({ checked: '2026-10-08', sources: sources, topics: topics, topicReviews: Object.freeze(topicReviews) });
}());
