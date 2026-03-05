# Skill Hunter - System Flowchart

## Main Application Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> Auth{Authenticated?}
    Auth -->|No| Login[Login/Register]
    Login --> CreateUser[(Create User Document)]
    CreateUser --> Dashboard
    Auth -->|Yes| Dashboard[Dashboard]
    
    Dashboard --> Upload[Upload Resume]
    Upload --> StoreFile[(Store in Firebase Storage)]
    StoreFile --> CreateResume[(Create Resume Document<br/>status: 'parsing')]
    CreateResume --> ParseResume[AI Resume Parser]
    
    ParseResume --> UpdateResume[(Update Resume Document<br/>with parsedData<br/>status: 'parsed')]
    UpdateResume --> AIAnalysis[AI Analysis:<br/>- Strength Areas<br/>- Improvement Areas<br/>- Suggested Roles]
    
    AIAnalysis --> FetchJobs[Fetch Jobs from<br/>DeepSeek-AI & Brave MCP]
    FetchJobs --> CreateMatches[(Create Job Match Documents<br/>with matchScore)]
    CreateMatches --> SortJobs[Sort by Match Score]
    SortJobs --> DisplayJobs[Display Top Job Matches]
    
    DisplayJobs --> UserSelect{User Selects Job?}
    UserSelect -->|No| Dashboard
    UserSelect -->|Yes| CalcATS[Calculate Initial ATS Score<br/>version: 1]
    
    CalcATS --> StoreATS[(Store ATS Score Document<br/>with breakdown & suggestions)]
    StoreATS --> CheckScore{ATS Score >= 90?}
    
    CheckScore -->|Yes| PassThreshold[✓ Resume Optimized]
    PassThreshold --> AskApply{Apply Now?}
    
    CheckScore -->|No| ShowSuggestions[Display Improvement<br/>Suggestions]
    ShowSuggestions --> ModifyResume[Modify Resume:<br/>- Rephrase content<br/>- Add keywords<br/>- Adjust format]
    
    ModifyResume --> CreateMod[(Create Modification Document<br/>with changes)]
    CreateMod --> SaveModified[(Save Modified Resume<br/>to Storage)]
    SaveModified --> RecalcATS[Recalculate ATS Score<br/>version: n+1]
    
    RecalcATS --> StoreNewATS[(Store New ATS Score<br/>with improvement delta)]
    StoreNewATS --> CheckScore
    
    AskApply -->|Yes| CreateApp[(Create Application Document<br/>status: 'applied')]
    CreateApp --> TrackApp[Track Application Status]
    TrackApp --> Dashboard
    
    AskApply -->|No| Dashboard
    
    style Start fill:#e1f5e1
    style PassThreshold fill:#90ee90
    style CheckScore fill:#fff4e6
    style UserSelect fill:#fff4e6
    style AskApply fill:#fff4e6
    style Auth fill:#fff4e6
```

---

## Detailed Resume Processing Flow

```mermaid
flowchart LR
    A[Resume Upload] --> B[Firebase Storage]
    B --> C{File Type Valid?}
    C -->|No| D[Error: Invalid Format]
    C -->|Yes| E[Create Resume Doc]
    
    E --> F[Status: 'parsing']
    F --> G[Extract Text]
    G --> H[Parse Sections:<br/>- Personal Info<br/>- Skills<br/>- Experience<br/>- Education<br/>- Certifications<br/>- Projects]
    
    H --> I[AI Analysis]
    I --> J[Update Resume Doc]
    J --> K[Status: 'parsed']
    K --> L[Ready for Job Matching]
    
    style A fill:#e3f2fd
    style B fill:#fff9c4
    style E fill:#c8e6c9
    style K fill:#90ee90
    style D fill:#ffcdd2
```

---

## Job Matching Algorithm Flow

```mermaid
flowchart TD
    Start[Parsed Resume Data] --> Extract[Extract Key Information:<br/>- Skills Array<br/>- Experience Level<br/>- Education<br/>- Preferred Locations]
    
    Extract --> Query1[Query DeepSeek-AI<br/>with skills & preferences]
    Extract --> Query2[Query Brave MCP<br/>for job listings]
    
    Query1 --> Merge[Merge & Deduplicate Results]
    Query2 --> Merge
    
    Merge --> Score[Calculate Match Score<br/>for each job]
    
    Score --> Breakdown[Score Breakdown:<br/>- Skill Match: 40%<br/>- Experience Match: 30%<br/>- Education Match: 15%<br/>- Location Match: 15%]
    
    Breakdown --> Identify[Identify:<br/>- Matched Skills<br/>- Missing Skills]
    
    Identify --> Store[(Store Job Match Documents)]
    Store --> Sort[Sort by Match Score DESC]
    Sort --> Display[Display to User]
    
    style Start fill:#e1f5e1
    style Display fill:#90ee90
```

---

## ATS Score Calculation Flow

```mermaid
flowchart TD
    Start[User Selects Job] --> Init[Initialize ATS Calculation<br/>version: 1]
    
    Init --> Parse[Parse Job Description:<br/>- Required Keywords<br/>- Required Skills<br/>- Experience Requirements<br/>- Education Requirements]
    
    Parse --> Compare[Compare Resume vs Job]
    
    Compare --> Calc1[Keyword Match Score<br/>0-100]
    Compare --> Calc2[Format Compliance Score<br/>0-100]
    Compare --> Calc3[Experience Match Score<br/>0-100]
    Compare --> Calc4[Skills Match Score<br/>0-100]
    Compare --> Calc5[Education Match Score<br/>0-100]
    
    Calc1 --> Avg[Calculate Weighted Average:<br/>Keywords: 30%<br/>Format: 15%<br/>Experience: 25%<br/>Skills: 20%<br/>Education: 10%]
    Calc2 --> Avg
    Calc3 --> Avg
    Calc4 --> Avg
    Calc5 --> Avg
    
    Avg --> Final[Final ATS Score]
    Final --> Store[(Store ATS Score Document)]
    
    Store --> Check{Score >= 90?}
    Check -->|Yes| Pass[✓ Pass Threshold]
    Check -->|No| Generate[Generate Suggestions]
    
    Generate --> Priority[Prioritize by Impact:<br/>- High Priority<br/>- Medium Priority<br/>- Low Priority]
    
    Priority --> Display[Display to User]
    
    style Start fill:#e3f2fd
    style Pass fill:#90ee90
    style Generate fill:#fff4e6
```

---

## Resume Modification & Iteration Flow

```mermaid
flowchart TD
    Start[ATS Score < 90] --> ShowSugg[Display Suggestions<br/>with Examples]
    
    ShowSugg --> Choose{Modification Type?}
    
    Choose -->|AI Auto-Fix| AI[AI Generates<br/>Modifications]
    Choose -->|Manual Edit| Manual[User Edits<br/>Resume]
    Choose -->|Hybrid| Hybrid[AI Suggests +<br/>User Reviews]
    
    AI --> Apply[Apply Changes]
    Manual --> Apply
    Hybrid --> Apply
    
    Apply --> Track[Track Changes:<br/>- Section Modified<br/>- Original Text<br/>- New Text<br/>- Reason]
    
    Track --> CreateMod[(Create Modification Document)]
    CreateMod --> UpdateResume[Update Resume Data]
    UpdateResume --> SaveFile[(Save Modified File<br/>to Storage)]
    
    SaveFile --> Recalc[Recalculate ATS Score<br/>version: n+1]
    Recalc --> Compare[Compare with Previous:<br/>- Score Delta<br/>- Improvement %]
    
    Compare --> StoreNew[(Store New ATS Score)]
    StoreNew --> Check{Score >= 90?}
    
    Check -->|Yes| Success[✓ Optimization Complete]
    Check -->|No| CheckIter{Iterations < 5?}
    
    CheckIter -->|Yes| ShowSugg
    CheckIter -->|No| MaxReached[Max Iterations Reached<br/>Show Best Version]
    
    Success --> Ready[Ready to Apply]
    MaxReached --> Ready
    
    style Start fill:#ffcdd2
    style Success fill:#90ee90
    style MaxReached fill:#fff4e6
```

---

## Application Tracking Flow

```mermaid
flowchart LR
    A[Apply to Job] --> B[(Create Application Document)]
    B --> C[Status: 'applied']
    
    C --> D{Status Update?}
    D -->|Screening| E[Status: 'screening']
    D -->|Interview| F[Status: 'interview']
    D -->|Offer| G[Status: 'offer']
    D -->|Rejected| H[Status: 'rejected']
    
    E --> D
    F --> I[Add Interview Details:<br/>- Round<br/>- Type<br/>- Date<br/>- Feedback]
    I --> D
    
    G --> J{Accept Offer?}
    J -->|Yes| K[Status: 'accepted']
    J -->|No| L[Status: 'declined']
    
    H --> M[End]
    K --> M
    L --> M
    
    style A fill:#e3f2fd
    style K fill:#90ee90
    style H fill:#ffcdd2
    style L fill:#fff4e6
```

---

## Database Write Operations Flow

```mermaid
flowchart TD
    Start[User Action] --> Type{Operation Type?}
    
    Type -->|Upload| Upload[Resume Upload]
    Type -->|Match| Match[Job Matching]
    Type -->|Score| Score[ATS Calculation]
    Type -->|Modify| Modify[Resume Modification]
    Type -->|Apply| Apply[Job Application]
    
    Upload --> W1[(Write: /users/{uid}/resumes/)]
    Match --> W2[(Write: /users/{uid}/jobMatches/)]
    Score --> W3[(Write: /users/{uid}/atsScores/)]
    Modify --> W4[(Write: /users/{uid}/resumeModifications/)]
    Apply --> W5[(Write: /users/{uid}/applications/)]
    
    W1 --> Update1[(Update: User metadata)]
    W2 --> Index1[Create Index:<br/>matchScore DESC]
    W3 --> Index2[Create Index:<br/>version ASC]
    W4 --> Link1[Link to:<br/>- resumeId<br/>- jobMatchId<br/>- atsScoreId]
    W5 --> Update2[(Update: Job Match status)]
    
    Update1 --> Complete[Operation Complete]
    Index1 --> Complete
    Index2 --> Complete
    Link1 --> Complete
    Update2 --> Complete
    
    style Start fill:#e1f5e1
    style Complete fill:#90ee90
```

---

## Data Retrieval & Sorting Flow

```mermaid
flowchart LR
    A[User Request] --> B{Query Type?}
    
    B -->|Latest Resume| C[Query: /resumes/<br/>orderBy: uploadedAt DESC<br/>limit: 1]
    
    B -->|Best Jobs| D[Query: /jobMatches/<br/>where: status == 'suggested'<br/>orderBy: matchScore DESC<br/>limit: 20]
    
    B -->|ATS History| E[Query: /atsScores/<br/>where: jobMatchId == X<br/>orderBy: version ASC]
    
    B -->|Active Apps| F[Query: /applications/<br/>where: status IN array<br/>orderBy: appliedAt DESC]
    
    C --> G[Return Data]
    D --> G
    E --> G
    F --> G
    
    G --> H[Display to User]
    
    style A fill:#e3f2fd
    style H fill:#90ee90
```

---

## Security & Access Control Flow

```mermaid
flowchart TD
    Request[User Request] --> Auth{Authenticated?}
    Auth -->|No| Deny[❌ Access Denied]
    Auth -->|Yes| CheckUID{request.auth.uid<br/>== userId?}
    
    CheckUID -->|No| Deny
    CheckUID -->|Yes| CheckOp{Operation Type?}
    
    CheckOp -->|Read| AllowRead[✓ Allow Read]
    CheckOp -->|Write| ValidateWrite{Valid Data?}
    CheckOp -->|Delete| ValidateDelete{Can Delete?}
    
    ValidateWrite -->|Yes| AllowWrite[✓ Allow Write]
    ValidateWrite -->|No| Deny
    
    ValidateDelete -->|Yes| AllowDelete[✓ Allow Delete]
    ValidateDelete -->|No| Deny
    
    AllowRead --> Execute[Execute Operation]
    AllowWrite --> Execute
    AllowDelete --> Execute
    
    style Deny fill:#ffcdd2
    style Execute fill:#90ee90
```

---

## Complete User Journey

```mermaid
flowchart TD
    Start([New User]) --> Register[Register/Login]
    Register --> Upload[Upload Resume]
    Upload --> Wait1[Wait for Parsing...]
    Wait1 --> ViewResume[View Parsed Resume]
    
    ViewResume --> Wait2[Wait for Job Matching...]
    Wait2 --> BrowseJobs[Browse Matched Jobs<br/>sorted by score]
    
    BrowseJobs --> Filter{Filter/Search?}
    Filter -->|Yes| ApplyFilter[Apply Filters:<br/>- Location<br/>- Job Type<br/>- Salary Range]
    ApplyFilter --> BrowseJobs
    Filter -->|No| SelectJob[Select Job]
    
    SelectJob --> ViewDetails[View Job Details]
    ViewDetails --> CalcATS[Calculate ATS Score]
    CalcATS --> ShowScore[Show Score & Breakdown]
    
    ShowScore --> Decision{Score >= 90?}
    Decision -->|Yes| ApplyNow[Apply to Job]
    Decision -->|No| ViewSugg[View Suggestions]
    
    ViewSugg --> ModChoice{How to Modify?}
    ModChoice -->|AI Auto| AutoMod[AI Auto-Modifies]
    ModChoice -->|Manual| ManualMod[User Edits]
    ModChoice -->|Review AI| ReviewMod[Review AI Suggestions]
    
    AutoMod --> Recalc[Recalculate Score]
    ManualMod --> Recalc
    ReviewMod --> Recalc
    
    Recalc --> ShowScore
    
    ApplyNow --> Track[Track Application]
    Track --> Updates[Receive Status Updates]
    Updates --> Dashboard[Return to Dashboard]
    
    Dashboard --> More{More Actions?}
    More -->|Upload New| Upload
    More -->|Browse Jobs| BrowseJobs
    More -->|View Apps| ViewApps[View Applications]
    More -->|Done| End([Exit])
    
    ViewApps --> Dashboard
    
    style Start fill:#e1f5e1
    style End fill:#90ee90
    style Decision fill:#fff4e6
    style ModChoice fill:#fff4e6
```

---

## Legend

- 🟢 **Green**: Success states, completion points
- 🟡 **Yellow**: Decision points, conditional logic
- 🔵 **Blue**: Start points, user actions
- 🔴 **Red**: Error states, denied access
- 📦 **Cylinder**: Database operations (read/write)
