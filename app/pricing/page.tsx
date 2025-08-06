"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PricingPage() {
  const [isUSD, setIsUSD] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <section className="w3o-container">
          <div className="w3o-container-inner">
            <div className="w3o-pt-wrapper">
              <div className="w3o-row w3o--ta-center">
                <div className="w3o-switcher">
                  <label
                    className={`w3o-switch-title ${
                      !isUSD ? "w3o-switch-title-active" : ""
                    }`}
                  >
                    AUD
                  </label>
                  <div className="w3o-toggle">
                    <input
                      type="checkbox"
                      id="w3o-switcher"
                      className="check"
                      checked={isUSD}
                      onChange={(e) => setIsUSD(e.target.checked)}
                    />
                    <span className="w3o-switch"></span>
                  </div>
                  <label
                    className={`w3o-switch-title ${
                      isUSD ? "w3o-switch-title-active" : ""
                    }`}
                  >
                    USD
                  </label>
                </div>
              </div>

              {/* Table start */}
              <div className="w3o-comparison-tbl">
                <div className="mobile-table-header">
                  <ul>
                    <li className="tabs tab4 tab-Selected" data-tab="tab-4">
                      Bronze
                    </li>
                    <li className="tabs tab1" data-tab="tab-1">
                      Silver
                    </li>
                    <li className="tabs tab2" data-tab="tab-2">
                      Gold
                    </li>
                    <li className="tabs tab3" data-tab="tab-3">
                      Platinum
                    </li>
                  </ul>
                </div>

                <div className="table-header">
                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">&nbsp;</div>

                    <div
                      className="tbl-col tbl-cont-col tbl-col5 tab-Selected"
                      id="tab-4"
                    >
                      <div className="price-tbl-title">Bronze</div>
                      <div className="price-btn pbtn-inline">
                        <div className="tbl-subs">
                          <span className={!isUSD ? "active" : "hidden"}>
                            <small>(AUD)</small>
                          </span>
                          <span className={isUSD ? "active" : "hidden"}>
                            <small>(USD)</small>
                          </span>
                        </div>
                        <div className={isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">$980</span>
                        </div>
                        <div className={!isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">$1,140</span>
                        </div>
                        <div className="prmonth">/Month</div>
                      </div>
                      <div className="tbl-subs">
                        No contract <br /> billed monthly
                      </div>
                    </div>

                    <div className="tbl-col tbl-cont-col tbl-col2" id="tab-1">
                      <div className="price-tbl-title">Silver</div>
                      <div className="price-btn pbtn-inline">
                        <div className="tbl-subs">
                          <span className={!isUSD ? "active" : "hidden"}>
                            <small>(AUD)</small>
                          </span>
                          <span className={isUSD ? "active" : "hidden"}>
                            <small>(USD)</small>
                          </span>
                        </div>
                        <div className={isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">$1,900</span>
                        </div>
                        <div className={!isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">$2,510</span>
                        </div>
                        <div className="prmonth">/Month</div>
                      </div>
                      <div className="tbl-subs">
                        No contract <br /> billed monthly
                      </div>
                    </div>

                    <div className="tbl-col tbl-cont-col tbl-col3" id="tab-2">
                      <div className="popular-label">Best Value</div>
                      <div className="price-tbl-title">Gold</div>
                      <div className="price-btn pbtn-inline">
                        <div className="tbl-subs">
                          <span className={!isUSD ? "active" : "hidden"}>
                            <small>(AUD)</small>
                          </span>
                          <span className={isUSD ? "active" : "hidden"}>
                            <small>(USD)</small>
                          </span>
                        </div>
                        <div className={isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">$2,900</span>
                        </div>
                        <div className={!isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">$3,150</span>
                        </div>
                        <div className="prmonth">/Month</div>
                      </div>
                      <div className="tbl-subs">
                        on annual contract <br /> billed monthly
                      </div>
                    </div>

                    <div className="tbl-col tbl-cont-col tbl-col4" id="tab-3">
                      <div className="price-tbl-title">Platinum</div>
                      <div className="price-btn">
                        <div className={isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">Get a quote</span>
                        </div>
                        <div className={!isUSD ? "active" : "hidden"}>
                          <span className="sale-prc">Get a quote</span>
                        </div>
                      </div>
                      <div className="tbl-subs">
                        on annual contract <br /> billed monthly
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-body">
                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Minimum
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      1 Admin user
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      1 Admin user
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      1 Admin user
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      1 Admin user
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Maximum
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      5 Core users
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      10 Core users
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      15 Core users
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">? Users</div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Maximum
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      20 Sales users
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      30 Sales users
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      40 Sales users
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">? Sales</div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Setup fees
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className={isUSD ? "active" : "hidden"}>$990</span>
                      <span className={!isUSD ? "active" : "hidden"}>
                        $1,300
                      </span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className={isUSD ? "active" : "hidden"}>
                        $1,350
                      </span>
                      <span className={!isUSD ? "active" : "hidden"}>
                        $1,750
                      </span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className={isUSD ? "active" : "hidden"}>
                        $1,600
                      </span>
                      <span className={!isUSD ? "active" : "hidden"}>
                        $1,750
                      </span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      Get a quote
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      CSV SFTP load only
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">Options</div>
                    <div className="tbl-col tbl-cont-col tbl-col4">Options</div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Unlimited accounts
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Unlimited open items
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Regions / Businesses
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">1</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">2</div>
                    <div className="tbl-col tbl-cont-col tbl-col3">3</div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      Unlimited
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Onboarding credit application per region****
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className={isUSD ? "active" : "hidden"}>$150</span>
                      <span className={!isUSD ? "active" : "hidden"}>$175</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className={isUSD ? "active" : "hidden"}>✓</span>
                      <span className={!isUSD ? "active" : "hidden"}>$175</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">$175</div>
                    <div className="tbl-col tbl-cont-col tbl-col4">✓</div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Setup Interactive credit report integration and monitoring
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className={isUSD ? "active" : "hidden"}>$150</span>
                      <span className={!isUSD ? "active" : "hidden"}>$175</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className={isUSD ? "active" : "hidden"}>$150</span>
                      <span className={!isUSD ? "active" : "hidden"}>$175</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className={isUSD ? "active" : "hidden"}>$150</span>
                      <span className={!isUSD ? "active" : "hidden"}>$175</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Credit reports @cost + 10%
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Approval process
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      ERP integration
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      Get a quote
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      Get a quote
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      Get a quote
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      Get a quote
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Kuhlekt collection management platform
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Multiple dunning procedures
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Escalations
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Provisioning
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Dispute workflow management
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Setup Invoice Receiving & Copies Sending**
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className={isUSD ? "active" : "hidden"}>$150</span>
                      <span className={!isUSD ? "active" : "hidden"}>$100</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Immediate or Bulk statements.
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Reporting options
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      AI quick Action templates
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      AI Communications
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      KPI staff management
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Payment management, Setup base is Stripe***
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className={isUSD ? "active" : "hidden"}>$140</span>
                      <span className={!isUSD ? "active" : "hidden"}>$100</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className={isUSD ? "active" : "hidden"}>✓</span>
                      <span className={!isUSD ? "active" : "hidden"}>✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Scheduled
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Ad hoc
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Reminders
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1">
                      Kuhlekt portal,
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">$250</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className={isUSD ? "active" : "hidden"}>$175</span>
                      <span className={!isUSD ? "active" : "hidden"}>$150</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Payments ***
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Direct Debits ***
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Download transactions CSV
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Dispute lodgement
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Invoice download
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>

                  <div className="tbl-row">
                    <div className="tbl-col tbl-title-col tbl-col1 w3o-subplan">
                      Statement download
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col5">&nbsp;</div>
                    <div className="tbl-col tbl-cont-col tbl-col2">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col3">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                    <div className="tbl-col tbl-cont-col tbl-col4">
                      <span className="w3o-symbl w3o-check">✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w3o-extra-info">
                <p>
                  <strong>
                    ** Copies received via email BCC from ERP alternate options
                    available by quote.
                  </strong>
                </p>
                <p>
                  <strong>
                    *** Based on Stripe other providers quoted. Fees to client
                    accounts.
                  </strong>
                </p>
                <p>
                  <strong>
                    **** Additional Regional Onboarding @ $140 PCM each in
                    currency selected table.
                  </strong>
                </p>
                <p>
                  <strong>Core</strong> Users defined as Finance, Collections
                  staff, Collection Managers, CFO, Accountants.
                </p>
                <p>
                  <strong>Sales</strong> Users defined as Sales and operational
                  staff required to have logins for workflow and escalations.
                </p>
                <p>
                  All figures in selected currency and exempt of any Taxes,
                  Duties and or fees.
                </p>
                <p>AUD available only in Australia</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .w3o-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .w3o-container-inner {
          width: 100%;
        }

        .w3o-pt-wrapper {
          width: 100%;
        }

        .w3o-row {
          margin-bottom: 30px;
        }

        .w3o--ta-center {
          text-align: center;
        }

        .w3o-switcher {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }

        .w3o-switch-title {
          font-size: 18px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
        }

        .w3o-switch-title-active {
          color: #2563eb;
        }

        .w3o-toggle {
          position: relative;
          width: 60px;
          height: 30px;
        }

        .check {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .w3o-switch {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 30px;
        }

        .w3o-switch:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        .check:checked + .w3o-switch {
          background-color: #2563eb;
        }

        .check:checked + .w3o-switch:before {
          transform: translateX(30px);
        }

        .w3o-comparison-tbl {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .mobile-table-header {
          display: none;
        }

        .table-header {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .table-body {
          background: white;
        }

        .tbl-row {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
        }

        .tbl-row:last-child {
          border-bottom: none;
        }

        .tbl-col {
          padding: 15px;
          border-right: 1px solid #e2e8f0;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .tbl-col:last-child {
          border-right: none;
        }

        .tbl-title-col {
          background: #f1f5f9;
          font-weight: 600;
          text-align: left;
          justify-content: flex-start;
          flex: 1.5;
        }

        .tbl-cont-col {
          position: relative;
        }

        .tbl-col3 {
          position: relative;
        }

        .tbl-col3::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .price-tbl-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .popular-label {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #f59e0b, #d97706);
          color: white;
          padding: 5px 15px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          z-index: 10;
        }

        .price-btn {
          margin-bottom: 15px;
        }

        .sale-prc {
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
        }

        .prmonth {
          font-size: 16px;
          color: #64748b;
          margin-top: 5px;
        }

        .tbl-subs {
          font-size: 14px;
          color: #64748b;
          line-height: 1.4;
        }

        .w3o-subplan {
          padding-left: 30px;
          font-size: 14px;
          color: #64748b;
        }

        .w3o-symbl {
          font-size: 18px;
          font-weight: bold;
        }

        .w3o-check {
          color: #10b981;
        }

        .w3o-extra-info {
          margin-top: 40px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
        }

        .w3o-extra-info p {
          margin-bottom: 10px;
        }

        .w3o-extra-info p:last-child {
          margin-bottom: 0;
        }

        .active {
          display: inline;
        }

        .hidden {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-table-header {
            display: block;
            background: #f8fafc;
            padding: 0;
          }

          .mobile-table-header ul {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .mobile-table-header li {
            flex: 1;
            padding: 15px 10px;
            text-align: center;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            font-weight: 600;
            font-size: 14px;
          }

          .mobile-table-header li.tab-Selected {
            border-bottom-color: #2563eb;
            color: #2563eb;
          }

          .table-header .tbl-row {
            flex-direction: column;
          }

          .table-body .tbl-row {
            flex-direction: column;
          }

          .tbl-col {
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
            justify-content: flex-start;
          }

          .tbl-title-col {
            background: #1e293b;
            color: white;
            font-weight: 600;
          }

          .w3o-switcher {
            flex-direction: column;
            gap: 10px;
          }

          .sale-prc {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
