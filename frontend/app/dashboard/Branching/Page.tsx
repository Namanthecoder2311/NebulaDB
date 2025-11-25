<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperBranch - Neon से Better Branching</title>

    <style>
        /* Global */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            padding: 20px;
            margin: auto;
        }

        header {
            text-align: center;
            padding: 40px 0;
            color: #fff;
        }

        header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, .3);
        }

        header p {
            opacity: .9;
            font-size: 1.2rem;
        }

        .comparison-badge {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 16px;
            font-weight: bold;
            border-radius: 20px;
            color: #fff;
            background: #ff6b6b;
        }

        /* Features */
        .features-grid {
            display: grid;
            gap: 20px;
            margin: 40px 0;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .feature-card {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            transition: .3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, .1);
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-card h3 {
            margin-bottom: 15px;
            color: #667eea;
            font-size: 1.4rem;
        }

        .feature-list {
            list-style: none;
        }

        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .feature-list li::before {
            content: "✅ ";
            margin-right: 8px;
        }

        /* Pricing */
        .pricing-tiers {
            display: grid;
            gap: 20px;
            margin: 40px 0;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .pricing-card {
            background: #fff;
            padding: 30px;
            text-align: center;
            border-radius: 15px;
            position: relative;
            transition: .3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, .1);
        }

        .pricing-card:hover {
            transform: scale(1.05);
        }

        .popular-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: .8rem;
            font-weight: bold;
            transform: translateX(-50%);
            color: #fff;
            background: #ff6b6b;
        }

        .price {
            margin: 20px 0;
            color: #667eea;
            font-size: 3rem;
            font-weight: bold;
        }

        .price span {
            color: #666;
            font-size: 1rem;
        }

        .tier-name {
            color: #333;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin-top: 20px;
            font-weight: bold;
            text-decoration: none;
            color: #fff;
            border-radius: 25px;
            background: #667eea;
            transition: .3s;
        }

        .btn:hover {
            background: #764ba2;
        }

        /* Demo / Comparison / Calculator */
        .demo-section {
            margin: 40px 0;
            padding: 40px;
            border-radius: 15px;
            background: #fff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, .1);
        }

        .demo-controls {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }

        .demo-controls input,
        .demo-controls select {
            flex: 1;
            padding: 10px;
            min-width: 200px;
            border-radius: 5px;
            border: 2px solid #ddd;
        }

        .demo-result {
            display: none;
            margin-top: 20px;
            padding: 20px;
            border-left: 4px solid #667eea;
            border-radius: 10px;
            background: #f8f9fa;
        }

        /* Table */
        .comparison-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
            box-shadow: 0 5px 15px rgba(0, 0, 0, .1);
            overflow: hidden;
            border-radius: 10px;
            background: #fff;
        }

        .comparison-table th {
            padding: 15px;
            color: #fff;
            background: #667eea;
            text-align: left;
        }

        .comparison-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        .comparison-table tr:hover {
            background: #f8f9fa;
        }

        .better {
            color: #28a745;
            font-weight: bold;
        }

        .worse {
            color: #dc3545;
            font-weight: bold;
        }

        /* Footer */
        footer {
            padding: 40px 0;
            text-align: center;
            color: rgba(255, 255, 255, .8);
        }

        @media(max-width: 768px) {
            header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>

<body>

    <div class="container">

        <!-- Header -->
        <header>
            <h1>🚀 SuperBranch</h1>
            <p>Neon से Better, Faster, Cheaper Branching Platform</p>
            <div class="comparison-badge">Neon से 20% सस्ता | 2x तेज | Better Features</div>
        </header>

        <!-- Features -->
        <section class="features-grid">
            <!-- Card 1 -->
            <div class="feature-card">
                <h3>⚡ Instant Branching</h3>
                <ul class="feature-list">
                    <li>1.5s में नई branch (Neon: 2s)</li>
                    <li>Zero-copy technology</li>
                    <li>Automatic data isolation</li>
                    <li>Branch from any point in history</li>
                </ul>
            </div>

            <!-- Card 2 -->
            <div class="feature-card">
                <h3>💰 Smart Pricing</h3>
                <ul class="feature-list">
                    <li>5 free branches (Neon: 3)</li>
                    <li>$0.08 per branch (Neon: $0.10)</li>
                    <li>AI-powered cost optimization</li>
                    <li>No hidden charges</li>
                </ul>
            </div>

            <!-- Card 3 -->
            <div class="feature-card">
                <h3>🔧 Advanced Features</h3>
                <ul class="feature-list">
                    <li>Schema + Data merging</li>
                    <li>Branch templates</li>
                    <li>Auto-scaling preview branches</li>
                    <li>Smart branch cleanup</li>
                </ul>
            </div>
        </section>

        <!-- Pricing Section -->
        <section>
            <h2 style="text-align:center; color:white; margin:40px 0;">Pricing Plans</h2>

            <div class="pricing-tiers">

                <!-- Free -->
                <div class="pricing-card">
                    <div class="tier-name">Forever Free</div>
                    <div class="price">$0<span>/month</span></div>
                    <ul class="feature-list">
                        <li>5 Branches</li>
                        <li>10GB Storage</li>
                        <li>200 Compute Hours</li>
                        <li>30 Days Retention</li>
                        <li>Community Support</li>
                    </ul>
                    <a href="#" class="btn">Get Started</a>
                </div>

                <!-- Starter -->
                <div class="pricing-card">
                    <div class="popular-badge">MOST POPULAR</div>
                    <div class="tier-name">Starter</div>
                    <div class="price">$12<span>/month</span></div>
                    <ul class="feature-list">
                        <li>20 Branches</li>
                        <li>25GB Storage</li>
                        <li>500 Compute Hours</li>
                        <li>90 Days Retention</li>
                        <li>Email + Chat Support</li>
                        <li>Preview Branches</li>
                    </ul>
                    <a href="#" class="btn">Start Free Trial</a>
                </div>

                <!-- Pro -->
                <div class="pricing-card">
                    <div class="tier-name">Professional</div>
                    <div class="price">$25<span>/month</span></div>
                    <ul class="feature-list">
                        <li>Unlimited Branches</li>
                        <li>100GB Storage</li>
                        <li>2000 Compute Hours</li>
                        <li>1 Year Retention</li>
                        <li>Priority Support</li>
                        <li>Advanced Analytics</li>
                    </ul>
                    <a href="#" class="btn">Go Professional</a>
                </div>

            </div>
        </section>

        <!-- Live Demo -->
        <section class="demo-section">
            <h2>🚀 Live Branching Demo</h2>
            <p>Create branches instantly and see SuperBranch performance.</p>

            <div class="demo-controls">
                <input id="branchName" type="text" value="feature/user-auth" placeholder="Enter branch name">
                <select id="sourceBranch">
                    <option value="main">From: main</option>
                    <option value="develop">From: develop</option>
                    <option value="staging">From: staging</option>
                </select>
                <select id="dataInclusion">
                    <option value="full">Full Data</option>
                    <option value="schema-only">Schema Only</option>
                    <option value="custom">Custom Dataset</option>
                </select>
                <button class="btn" onclick="createBranch()">Create Branch</button>
            </div>

            <div id="demoResult" class="demo-result"></div>
        </section>

        <!-- Comparison Table -->
        <section class="demo-section">
            <h2>📊 SuperBranch vs Neon Comparison</h2>

            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th>SuperBranch</th>
                        <th>Neon</th>
                        <th>Advantage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Branch Creation Time</td>
                        <td class="better">1.5 seconds</td>
                        <td>2 seconds</td>
                        <td class="better">25% Faster</td>
                    </tr>
                    <tr>
                        <td>Free Branches</td>
                        <td class="better">5 branches</td>
                        <td>3 branches</td>
                        <td class="better">2 More Free</td>
                    </tr>
                    <tr>
                        <td>Price per Branch</td>
                        <td class="better">$0.08</td>
                        <td>$0.10</td>
                        <td class="better">20% Cheaper</td>
                    </tr>
                    <tr>
                        <td>Branch Types</td>
                        <td class="better">5 Types</td>
                        <td>3 Types</td>
                        <td class="better">More Flexible</td>
                    </tr>
                    <tr>
                        <td>CI/CD Integration</td>
                        <td class="better">Advanced</td>
                        <td>Basic</td>
                        <td class="better">Better Automation</td>
                    </tr>
                    <tr>
                        <td>Cost Optimization</td>
                        <td class="better">AI-Powered</td>
                        <td>Manual</td>
                        <td class="better">Smarter Savings</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- Calculator -->
        <section class="demo-section">
            <h2>💰 Cost Calculator</h2>
            <p>Calculate your savings vs Neon.</p>

            <div class="demo-controls">
                <input id="branchCount" type="number" value="15" placeholder="Number of Branches" min="0">
                <input id="storageGB" type="number" value="50" placeholder="Storage (GB)" min="0">
                <input id="computeHours" type="number" value="200" placeholder="Compute Hours" min="0">
                <button class="btn" onclick="calculateCost()">Calculate Savings</button>
            </div>

            <div id="costResult" class="demo-result"></div>
        </section>

    </div>

    <footer>
        © 2024 SuperBranch. All rights reserved.
    </footer>

    <script>
        /* Backend Simulation */
        class SuperBranchBackend {

            constructor() {
                this.branches = [];
                this.usageStats = {
                    branchesCreated: 0,
                    totalSavings: 0
                };
            }

            async createBranch(data) {
                const branch = {
                    id: "branch_" + Date.now(),
                    name: data.name,
                    source: data.source,
                    dataInclusion: data.dataInclusion,
                    size: this.getSize(data.dataInclusion),
                    status: "creating",
                    createdAt: new Date()
                };

                await new Promise(r => setTimeout(r, 1500));

                branch.status = "active";
                this.branches.push(branch);
                this.usageStats.branchesCreated++;

                return branch;
            }

            getSize(type) {
                const sizes = {
                    "full": "5GB",
                    "schema-only": "500MB",
                    "custom": "2GB"
                };
                return sizes[type] || "1GB";
            }

            calculateCost(input) {
                const ours = {
                    branches: Math.max(0, input.branches - 5) * 0.08,
                    storage: input.storage * 0.08,
                    compute: input.compute * 0.08
                };
                ours.total = ours.branches + ours.storage + ours.compute;

                const neon = {
                    branches: Math.max(0, input.branches - 3) * 0.10,
                    storage: input.storage * 0.10,
                    compute: input.compute * 0.10
                };
                neon.total = neon.branches + neon.storage + neon.compute;

                const savings = neon.total - ours.total;
                const percent = ((savings / neon.total) * 100).toFixed(1);

                this.usageStats.totalSavings += savings;

                return {
                    ours, neon,
                    savings,
                    percent
                };
            }

            getBranches() {
                return this.branches;
            }

            getStats() {
                return this.usageStats;
            }
        }

        const backend = new SuperBranchBackend();

        /* Frontend Methods */
        async function createBranch() {
            const name = document.getElementById("branchName").value;
            const source = document.getElementById("sourceBranch").value;
            const dataInclusion = document.getElementById("dataInclusion").value;

            const output = document.getElementById("demoResult");
            output.style.display = "block";
            output.innerHTML = `
                <h3>🚀 Creating Branch...</h3>
                <p><strong>${name}</strong> from <strong>${source}</strong></p>
                <p>Data: ${dataInclusion}</p>
                <p>⏳ Creation time: 1.5s</p>
            `;

            const result = await backend.createBranch({ name, source, dataInclusion });

            output.innerHTML = `
                <h3 style="color:#28a745;">Branch Created Successfully</h3>
                <p><strong>${result.name}</strong> is active</p>
                <p>Size: ${result.size}</p>
                <p>Created in: <strong>1.5s</strong></p>
                <button class="btn" onclick="showBranches()">View All Branches</button>
            `;
        }

        function calculateCost() {
            const branches = Number(document.getElementById("branchCount").value);
            const storage = Number(document.getElementById("storageGB").value);
            const compute = Number(document.getElementById("computeHours").value);

            const result = backend.calculateCost({ branches, storage, compute });

            const output = document.getElementById("costResult");
            output.style.display = "block";

            output.innerHTML = `
                <h3>💰 Cost Comparison</h3>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;">
                    <div style="padding:15px;border-radius:10px;background:#e8f5e8;">
                        <h4 style="color:#28a745;">SuperBranch</h4>
                        <p>Branches: $${result.ours.branches.toFixed(2)}</p>
                        <p>Storage: $${result.ours.storage.toFixed(2)}</p>
                        <p>Compute: $${result.ours.compute.toFixed(2)}</p>
                        <hr>
                        <p><strong>Total: $${result.ours.total.toFixed(2)}</strong></p>
                    </div>

                    <div style="padding:15px;border-radius:10px;background:#ffe8e8;">
                        <h4 style="color:#dc3545;">Neon</h4>
                        <p>Branches: $${result.neon.branches.toFixed(2)}</p>
                        <p>Storage: $${result.neon.storage.toFixed(2)}</p>
                        <p>Compute: $${result.neon.compute.toFixed(2)}</p>
                        <hr>
                        <p><strong>Total: $${result.neon.total.toFixed(2)}</strong></p>
                    </div>
                </div>

                <div style="margin-top:20px;padding:15px;border-radius:10px;text-align:center;background:#28a745;color:#fff;">
                    <h3>You Save ${result.percent}%</h3>
                    <p>Monthly Savings: $${result.savings.toFixed(2)}</p>
                    <p>Yearly Savings: $${(result.savings * 12).toFixed(2)}</p>
                </div>
            `;
        }

        function showBranches() {
            const branches = backend.getBranches();
            const output = document.getElementById("demoResult");

            let html = `<h3> Your Branches (${branches.length})</h3>`;

            branches.forEach(b => {
                html += `
                    <div style="background:#f8f9fa;margin:5px 0;padding:10px;border-left:4px solid #667eea;border-radius:5px;">
                        <strong>${b.name}</strong>
                        <span style="float:right;color:#28a745;">${b.status}</span>
                        <br>
                        <small>Source: ${b.source} | Size: ${b.size}</small>
                    </div>
                `;
            });

            output.innerHTML = html;
        }

        /* Demo Auto-Seed */
        window.onload = () => {
            backend.createBranch({
                name: "develop",
                source: "main",
                dataInclusion: "full"
            });
        };
    </script>

</body>
</html>
