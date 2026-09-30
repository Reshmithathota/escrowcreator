let contracts = JSON.parse(localStorage.getItem("contracts")) || [];
let payouts = JSON.parse(localStorage.getItem("payouts")) || [];


// =============================
// PAGE NAVIGATION
// =============================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageName).classList.remove("hidden");

    if (pageName === "dashboard") {
        displayDashboard();
    }

    if (pageName === "contracts") {
        displayContracts();
    }

    if (pageName === "payouts") {
        displayPayouts();
    }
}


// =============================
// CREATE CONTRACT
// =============================

function createContract() {

    const brand = document.getElementById("brand").value;
    const influencer = document.getElementById("influencer").value;
    const campaign = document.getElementById("campaign").value;
    const amount = Number(document.getElementById("amount").value);
    const platformFee = amount * 0.02;
    const totalPayment = amount + platformFee;
    const platform = document.getElementById("platform").value;

    const m1name = document.getElementById("m1name").value;
    const m2name = document.getElementById("m2name").value;
    const m3name = document.getElementById("m3name").value;

    const p1 = Number(document.getElementById("m1percent").value);
    const p2 = Number(document.getElementById("m2percent").value);
    const p3 = Number(document.getElementById("m3percent").value);

    if (!brand || !influencer || !campaign || !amount) {
        alert("Please fill all contract details.");
        return;
    }

    if (p1 + p2 + p3 !== 100) {
        alert("Milestone percentages must total exactly 100%.");
        return;
    }

    const contract = {

        id: "ESC-" + Math.floor(1000 + Math.random() * 9000),

        brand: brand,

        influencer: influencer,

        campaign: campaign,

        amount: amount,

        platformFee: platformFee,

        totalPayment: totalPayment,

        platform: platform,

        deposited: false,

        released: 0,

        milestones: [

            {
                name: m1name,
                percentage: p1,
                verified: false
            },

            {
                name: m2name,
                percentage: p2,
                verified: false
            },

            {
                name: m3name,
                percentage: p3,
                verified: false
            }

        ]

    };

    contracts.push(contract);
    localStorage.setItem("contracts", JSON.stringify(contracts));

    alert("Contract created successfully!");

    clearForm();

    showPage("dashboard");

    displayDashboard();
}


// =============================
// CLEAR FORM
// =============================

function clearForm() {

    document.getElementById("brand").value = "";
    document.getElementById("influencer").value = "";
    document.getElementById("campaign").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("postUrl").value = "";

}


// =============================
// DASHBOARD
// =============================

function displayDashboard() {

    updateStats();

    const container =
        document.getElementById("activeContract");


    if (contracts.length === 0) {

        container.innerHTML = `

            <div class="contract">

                <h3>No contracts yet</h3>

                <p>
                    Create your first sponsorship contract.
                </p>

            </div>

        `;

        return;
    }


    const contract =
        contracts[contracts.length - 1];


    let verifiedPercentage = 0;


    contract.milestones.forEach(m => {

        if (m.verified) {

            verifiedPercentage +=
                m.percentage;

        }

    });


    // =============================
    // MILESTONES
    // =============================

    let milestoneHTML = "";


    contract.milestones.forEach(
        (milestone, index) => {

            const payout =
                contract.amount *
                milestone.percentage /
                100;


            if (milestone.verified) {

                milestoneHTML += `

                    <div class="milestone">

                        <div class="milestone-number">
                            ✓
                        </div>

                        <div class="milestone-info">

                            <h4>
                                ${milestone.name}
                            </h4>

                            <p>
                                ${milestone.percentage}%
                                •
                                ₹${payout.toLocaleString()}
                            </p>

                        </div>

                        <span class="released">

                            ₹${payout.toLocaleString()}
                            RELEASED

                        </span>

                    </div>

                `;

            }

            else {

                milestoneHTML += `

                    <div class="milestone">

                        <div class="milestone-number">

                            ${index + 1}

                        </div>

                        <div class="milestone-info">

                            <h4>
                                ${milestone.name}
                            </h4>

                            <p>
                                ${milestone.percentage}%
                                •
                                ₹${payout.toLocaleString()}
                            </p>

                        </div>

                        <button
                           class="release-button"
                           onclick="verifyMilestone(${index})"
                        >
                           Verify & Release
                        </button>

                    </div>

                `;

            }

        }
    );


    // =============================
    // VERIFICATION EVIDENCE
    // =============================

    const evidenceHTML = `

        <div class="evidence-box">

            <div class="evidence-header">

                <div>

                    <h3>
                        🔍 Verification Evidence
                    </h3>

                    <p>
                        Automated checks against the
                        contractual requirements.
                    </p>

                </div>

                <span class="verification-badge">
                    TEST VERIFICATION
                </span>

            </div>


            <div class="evidence-grid">

                <div class="evidence-item">

                    <span class="check">
                        ✓
                    </span>

                    <div>
                        <b>Post exists publicly</b>

                        <small>
                            Social content detected
                        </small>
                    </div>

                </div>


                <div class="evidence-item">

                    <span class="check">
                        ✓
                    </span>

                    <div>
                        <b>Required hashtag detected</b>

                        <small>
                            Sponsored campaign tag found
                        </small>
                    </div>

                </div>


                <div class="evidence-item">

                    <span class="check">
                        ✓
                    </span>

                    <div>
                        <b>Sponsorship disclosure detected</b>

                        <small>
                            Disclosure requirement checked
                        </small>
                    </div>

                </div>


                <div class="evidence-item">

                    <span class="check">
                        ✓
                    </span>

                    <div>
                        <b>Content live duration checked</b>

                        <small>
                            Contract window verified
                        </small>
                    </div>

                </div>

            </div>


            <div class="evidence-footer">

                <span>
                    🛡️ Verification engine
                </span>

                <strong>
                    READY
                </strong>

            </div>

        </div>

    `;


    // =============================
    // FINAL CONTRACT DISPLAY
    // =============================

    container.innerHTML = `

        <div class="contract">

            <div class="contract-header">

                <div>

                    <div class="contract-id">

                        ${contract.id}

                    </div>

                    <h2>

                        ${contract.campaign}

                    </h2>

                    <div class="contract-info">

                        ${contract.brand}

                        →

                        ${contract.influencer}

                        •

                        ${contract.platform}

                    </div>

                </div>


                <span class="status">

                    ${
                        contract.deposited
                            ? "FUNDS DEPOSITED"
                            : "PENDING DEPOSIT"
                    }

                </span>

            </div>


            <div class="contract-value">

                <span>
                    Overall Contract Value
                </span>

                <strong>
                    ₹${contract.amount.toLocaleString()}
                </strong>

            </div>
            <div class="contract-fee">
                <span>
                    Platform Fee (2%)
                </span>

                <strong>
                    ₹${(contract.platformFee ?? contract.amount * 0.02).toLocaleString()}
                </strong>
            </div>

            <div class="contract-fee">
                <span>
                    Brand Total
                </span>

                 <strong>
                    ₹${(contract.totalPayment ?? contract.amount * 1.02).toLocaleString()}
                </strong>
            </div>


            <div class="progress-label">

                <span>
                    Verification Progress
                </span>

                <b>
                    ${verifiedPercentage}%
                </b>

            </div>


            <div class="progress-bar">

                <div
                    class="progress"
                    style="width:${verifiedPercentage}%"
                ></div>

            </div>


            ${
                !contract.deposited

                    ?

                `

                    <button
                        class="main-button"
                        style="margin:20px 0"
                        onclick="depositFunds()"
                    >

                        💳 Simulate Brand Deposit

                    </button>

                `

                    :

                `

                    <div class="deposit-success">

                        ✓ Funds deposited with payment provider

                        <span>
                            TEST MODE
                        </span>

                    </div>

                `
            }


            <div class="milestone-title">

                <h3>
                    Contract Milestones
                </h3>

                <span>
                    Percentage-based payouts
                </span>

            </div>


            ${milestoneHTML}


            ${evidenceHTML}


        </div>

    `;
}


// =============================
// DEPOSIT FUNDS
// =============================

function depositFunds() {

    if (contracts.length === 0) return;


    const contract =
        contracts[contracts.length - 1];


    contract.deposited = true;


    alert(
        "Payment provider accepted the deposit in TEST MODE."
    );


    displayDashboard();

}


// =============================
// VERIFY MILESTONE
// =============================

function verifyMilestone(index) {

    const contract =
        contracts[contracts.length - 1];


    if (!contract.deposited) {

        alert(
            "Brand must deposit funds first."
        );

        return;
    }


    const milestone =
        contract.milestones[index];


    if (milestone.verified) return;


    milestone.verified = true;


    const payout =
        contract.amount *
        milestone.percentage /
        100;


    contract.released += payout;


    const payment = {

        id:
            "PAY-" +
            Math.floor(
                10000 +
                Math.random() * 90000
            ),

        contract:
            contract.id,

        milestone:
            milestone.name,

        amount:
            payout,

        status:
            "RELEASED"

    };


    payouts.push(payment);
    localStorage.setItem("payouts", JSON.stringify(payouts));


    alert(

        `Milestone verified!\n\n` +

        `₹${payout.toLocaleString()} ` +

        `released to ${contract.influencer}.`

    );


    displayDashboard();

}


// =============================
// CONTRACT LIST
// =============================

function displayContracts() {

    const container =
        document.getElementById("contractList");


    if (contracts.length === 0) {

        container.innerHTML = `

            <div class="contract">

                No contracts created yet.

            </div>

        `;

        return;

    }


    container.innerHTML =

        contracts.map(contract => `

            <div
                class="contract"
                style="margin-bottom:15px"
            >

                <div class="contract-header">

                    <div>

                        <div class="contract-id">

                            ${contract.id}

                        </div>

                        <h2>

                            ${contract.campaign}

                        </h2>

                        <p class="contract-info">

                            ${contract.brand}

                            →

                            ${contract.influencer}

                        </p>

                    </div>


                    <span class="status">

                        ${
                            contract.deposited
                                ? "FUNDS DEPOSITED"
                                : "PENDING DEPOSIT"
                        }

                    </span>

                </div>


                <div class="contract-value">

                    <span>
                        Contract Value
                    </span>

                    <strong>
                        ₹${contract.amount.toLocaleString()}
                    </strong>

                </div>

            </div>

        `).join("");

}


// =============================
// PAYOUT LEDGER
// =============================

function displayPayouts() {

    const table =
        document.getElementById("payoutTable");


    if (payouts.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5">

                    No payouts yet.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        payouts.map(payment => `

            <tr>

                <td>
                    ${payment.id}
                </td>

                <td>
                    ${payment.contract}
                </td>

                <td>
                    ${payment.milestone}
                </td>

                <td>

                    <b>
                        ₹${payment.amount.toLocaleString()}
                    </b>

                </td>

                <td>

                    <span class="released">

                        ✓ ${payment.status}

                    </span>

                </td>

            </tr>

        `).join("");

}


// =============================
// DASHBOARD STATS
// =============================

function updateStats() {

    const totalValue =

        contracts.reduce(

            (sum, contract) =>

                sum + contract.amount,

            0

        );


    const releasedValue =

        payouts.reduce(

            (sum, payment) =>

                sum + payment.amount,

            0

        );


    document.getElementById(
        "contractCount"
    ).innerText = contracts.length;


    document.getElementById(
        "totalValue"
    ).innerText =
        "₹" +
        totalValue.toLocaleString();


    document.getElementById(
        "releasedValue"
    ).innerText =
        "₹" +
        releasedValue.toLocaleString();


    document.getElementById(
        "verificationCount"
    ).innerText =
        payouts.length;

}


// =============================
// PERCENTAGE CALCULATOR
// =============================

document.querySelectorAll(
    "#m1percent, #m2percent, #m3percent"
).forEach(input => {

    input.addEventListener(
        "input",
        updatePercentage
    );

});


function updatePercentage() {

    const p1 =
        Number(
            document.getElementById(
                "m1percent"
            ).value
        );


    const p2 =
        Number(
            document.getElementById(
                "m2percent"
            ).value
        );


    const p3 =
        Number(
            document.getElementById(
                "m3percent"
            ).value
        );


    const total =
        p1 + p2 + p3;


    document.getElementById(
        "percentageTotal"
    ).innerText =
        total + "%";


    if (total === 100) {

        document.getElementById(
            "percentageTotal"
        ).style.color =
            "#15946f";

    }

    else {

        document.getElementById(
            "percentageTotal"
        ).style.color =
            "#d85b5b";

    }

}


// =============================
// START APPLICATION
// =============================

displayDashboard();

function switchRole(role) {

    const brandBtn = document.getElementById("brandRoleBtn");
    const influencerBtn = document.getElementById("influencerRoleBtn");
    const dashboardTitle = document.getElementById("dashboardTitle");

    if (role === "brand") {

        brandBtn.classList.add("active");
        influencerBtn.classList.remove("active");

        dashboardTitle.innerText = "Brand Dashboard";

        alert("Brand Dashboard selected");

    } else {

        influencerBtn.classList.add("active");
        brandBtn.classList.remove("active");

        dashboardTitle.innerText = "Influencer Dashboard";

        alert("Influencer Dashboard selected");
    }
}
