<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SuperBranch - Neon से Better Branching</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            text-align: center;
            padding: 40px 0;
            color: white;
        }

        header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .comparison-badge {
            background: #ff6b6b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 10px;
            display: inline-block;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .feature-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.4rem;
        }

        .feature-list {
            list-style: none;
        }

        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .feature-list li:before {
            content: "✅ ";
            margin-right: 8px;
        }

        .pricing-tiers {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .pricing-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
            transition: transform 0.3s ease;
        }

        .pricing-card:hover {
            transform: scale(1.05);
        }

        .popular-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .price {
            font-size: 3rem;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
        }

        .price span {
            font-size: 1rem;
            color: #666;
        }

        .tier-name {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
        }

        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin-top: 20px;
            transition: background 0.3s ease;
        }

        .btn:hover {
            background: #764ba2;
        }

        .demo-section {
            background: white;
            padding: 40px;
            border-radius: 15px;
            margin: 40px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .demo-controls {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }

        .demo-controls input, .demo-controls select {
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            flex: 1;
            min-width: 200px;
        }

        .demo-result {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 4px solid #667eea;
        }

        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .comparison-table th, .comparison-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        .comparison-table th {
            background: #667eea;
            color: white;
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

        footer {
            text-align: center;
            padding: 40px 0;
            color: white;
            opacity: 0.8;
        }

        @media (max-width: 768px) {
            .features-grid, .pricing-tiers {
                grid-template-columns: 1fr;
            }
            
            header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 SuperBranch</h1>
            <p>Neon से Better, Faster, Cheaper Branching Platform</p>
            <div class="comparison-badge">Neon से 20% सस्ता | 2x तेज | Better Features</div>
        </header>

        <!-- Features Section -->
        <section class="features-grid">
            <div class="feature-card">
                <h3>⚡ Instant Branching</h3>
                <ul class="feature-list">
                    <li>1.5s में नई branch (Neon: 2s)</li>
                    <li>Zero-copy technology</li>
                    <li>Automatic data isolation</li>
                    <li>Branch from any point in history</li>
                </ul>
            </div>
            
            <div class="feature-card">
                <h3>💰 Smart Pricing</h3>
                <ul class="feature-list">
                    <li>5 free branches (Neon: 3)</li>
                    <li>$0.08 per branch (Neon: $0.10)</li>
                    <li>AI-powered cost optimization</li>
                    <li>No hidden charges</li>
                </ul>
            </div>
            
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

        <!-- Pricing Tiers -->
        <section>
            <h2 style="text-align: center; color: white; margin: 40px 0;">Pricing Plans</h2>
            <div class="pricing-tiers">
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

        <!-- Demo Section -->
        <section class="demo-section">
            <h2>🚀 Live Branching Demo</h2>
            <p>Create branches instantly and see the power of SuperBranch</p>
            
            <div class="demo-controls">
                <input type="text" id="branchName" placeholder="Enter branch name" value="feature/user-auth">
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
                <button onclick="createBranch()" class="btn">Create Branch</button>
            </div>
            
            <div id="demoResult" class="demo-result" style="display: none;">
                <!-- Results will be shown here -->
            </div>
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

        <!-- Cost Calculator -->
        <section class="demo-section">
            <h2>💰 Cost Calculator</h2>
            <p>See how much you'll save compared to Neon</p>
            
            <div class="demo-controls">
                <input type="number" id="branchCount" placeholder="Number of Branches" value="15" min="0">
                <input type="number" id="storageGB" placeholder="Storage (GB)" value="50" min="0" step="1">
                <input type="number" id="computeHours" placeholder="Compute Hours" value="200" min="0">
                <button onclick="calculateCost()" class="btn">Calculate Savings</button>
            </div>
            
            <div id="costResult" class="demo-result" style="display: none;">
                <!-- Cost results will be shown here -->
            </div>
        </section>
    </div>

    <footer>
        <p>© 2024 SuperBranch. All rights reserved. | Built with ❤️ for Developers</p>
    </footer>

    <!-- Backend + Frontend JavaScript -->
    <script>
        // Backend Logic - Branching System
        class SuperBranchBackend {
            constructor() {
                this.branches = [];
                this.usageStats = {
                    branchesCreated: 0,
                    totalSavings: 0
                };
            }

            // Branch creation - Neon से faster
            async createBranch(branchData) {
                const branch = {
                    id: 'branch_' + Date.now(),
                    name: branchData.name,
                    source: branchData.source,
                    dataInclusion: branchData.dataInclusion,
                    status: 'creating',
                    createdAt: new Date(),
                    size: this.calculateBranchSize(branchData)
                };

                // Simulate fast branch creation (1.5s vs Neon's 2s)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                branch.status = 'active';
                branch.readyAt = new Date();
                this.branches.push(branch);
                this.usageStats.branchesCreated++;
                
                return branch;
            }

            calculateBranchSize(branchData) {
                const sizes = {
                    'full': '5GB',
                    'schema-only': '500MB', 
                    'custom': '2GB'
                };
                return sizes[branchData.dataInclusion] || '1GB';
            }

            // Cost calculation - Neon से better pricing
            calculateCost(usage) {
                const ourCost = {
                    branches: Math.max(0, usage.branches - 5) * 0.08, // 5 free branches
                    storage: usage.storage * 0.08, // $0.08/GB vs Neon's $0.10
                    compute: usage.compute * 0.08, // $0.08/hour vs Neon's $0.10
                    total: 0
                };
                
                ourCost.total = ourCost.branches + ourCost.storage + ourCost.compute;
                
                // Neon's cost for comparison
                const neonCost = {
                    branches: Math.max(0, usage.branches - 3) * 0.10, // 3 free branches
                    storage: usage.storage * 0.10,
                    compute: usage.compute * 0.10,
                    total: 0
                };
                
                neonCost.total = neonCost.branches + neonCost.storage + neonCost.compute;
                
                const savings = neonCost.total - ourCost.total;
                const savingsPercentage = ((savings / neonCost.total) * 100).toFixed(1);
                
                this.usageStats.totalSavings += savings;
                
                return {
                    ourPlatform: ourCost,
                    neon: neonCost,
                    savings: savings,
                    savingsPercentage: savingsPercentage
                };
            }

            // Get all branches
            getBranches() {
                return this.branches;
            }

            // Get usage statistics
            getStats() {
                return this.usageStats;
            }
        }

        // Frontend Logic
        const backend = new SuperBranchBackend();

        // Branch creation function
        async function createBranch() {
            const branchName = document.getElementById('branchName').value;
            const sourceBranch = document.getElementById('sourceBranch').value;
            const dataInclusion = document.getElementById('dataInclusion').value;
            
            const demoResult = document.getElementById('demoResult');
            demoResult.innerHTML = `
                <div style="text-align: center;">
                    <h3>🚀 Creating Branch...</h3>
                    <p>Branch: <strong>${branchName}</strong></p>
                    <p>Source: <strong>${sourceBranch}</strong></p>
                    <p>Data: <strong>${dataInclusion}</strong></p>
                    <div class="loading">⏳ Creating branch (1.5s)...</div>
                </div>
            `;
            demoResult.style.display = 'block';

            try {
                const branch = await backend.createBranch({
                    name: branchName,
                    source: sourceBranch,
                    dataInclusion: dataInclusion
                });

                demoResult.innerHTML = `
                    <div style="text-align: center; color: #28a745;">
                        <h3>✅ Branch Created Successfully!</h3>
                        <p><strong>${branch.name}</strong> is now active</p>
                        <p>Size: ${branch.size} | Status: ${branch.status}</p>
                        <p>Created in: <strong>1.5 seconds</strong> (Neon में 2 seconds लगते)</p>
                        <p>Branch ID: ${branch.id}</p>
                        <div style="margin-top: 15px;">
                            <button onclick="showAllBranches()" class="btn">View All Branches</button>
                        </div>
                    </div>
                `;
            } catch (error) {
                demoResult.innerHTML = `
                    <div style="text-align: center; color: #dc3545;">
                        <h3>❌ Error Creating Branch</h3>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        // Cost calculation function
        function calculateCost() {
            const branches = parseInt(document.getElementById('branchCount').value) || 0;
            const storage = parseInt(document.getElementById('storageGB').value) || 0;
            const compute = parseInt(document.getElementById('computeHours').value) || 0;
            
            const costResult = document.getElementById('costResult');
            
            const result = backend.calculateCost({
                branches: branches,
                storage: storage,
                compute: compute
            });

            costResult.innerHTML = `
                <h3>💰 Cost Comparison Results</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 10px;">
                        <h4 style="color: #28a745;">SuperBranch</h4>
                        <p>Branches: $${result.ourPlatform.branches.toFixed(2)}</p>
                        <p>Storage: $${result.ourPlatform.storage.toFixed(2)}</p>
                        <p>Compute: $${result.ourPlatform.compute.toFixed(2)}</p>
                        <hr>
                        <p><strong>Total: $${result.ourPlatform.total.toFixed(2)}/month</strong></p>
                    </div>
                    <div style="background: #ffe8e8; padding: 15px; border-radius: 10px;">
                        <h4 style="color: #dc3545;">Neon</h4>
                        <p>Branches: $${result.neon.branches.toFixed(2)}</p>
                        <p>Storage: $${result.neon.storage.toFixed(2)}</p>
                        <p>Compute: $${result.neon.compute.toFixed(2)}</p>
                        <hr>
                        <p><strong>Total: $${result.neon.total.toFixed(2)}/month</strong></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px; padding: 15px; background: #28a745; color: white; border-radius: 10px;">
                    <h3>🎉 आप ${result.savingsPercentage}% बचत करेंगे!</h3>
                    <p>Monthly Savings: <strong>$${result.savings.toFixed(2)}</strong></p>
                    <p>Yearly Savings: <strong>$${(result.savings * 12).toFixed(2)}</strong></p>
                </div>
            `;
            costResult.style.display = 'block';
        }

        // Show all branches
        function showAllBranches() {
            const branches = backend.getBranches();
            const stats = backend.getStats();
            
            const demoResult = document.getElementById('demoResult');
            
            if (branches.length === 0) {
                demoResult.innerHTML = `
                    <div style="text-align: center;">
                        <h3>No branches created yet</h3>
                        <p>Create your first branch above!</p>
                    </div>
                `;
                return;
            }
            
            let branchesHTML = `
                <h3>📁 Your Branches (${branches.length})</h3>
                <div style="margin-top: 15px;">
            `;
            
            branches.forEach(branch => {
                branchesHTML += `
                    <div style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 4px solid #667eea;">
                        <strong>${branch.name}</strong> 
                        <span style="float: right; color: #28a745;">${branch.status}</span>
                        <br>
                        <small>Source: ${branch.source} | Size: ${branch.size} | Created: ${new Date(branch.createdAt).toLocaleTimeString()}</small>
                    </div>
                `;
            });
            
            branchesHTML += `
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #667eea; color: white; border-radius: 5px;">
                    <strong>Statistics:</strong> ${stats.branchesCreated} branches created | Total savings: $${stats.totalSavings.toFixed(2)}
                </div>
            `;
            
            demoResult.innerHTML = branchesHTML;
        }

        // Initialize with some demo data
        window.onload = function() {
            // Pre-populate with a demo branch
            backend.createBranch({
                name: 'develop',
                source: 'main', 
                dataInclusion: 'full'
            });
        };
    </script>
</body>
</html>