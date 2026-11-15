# Flame in Freefall

## NASA Space Apps Challenge 2026

**SI-Powered Fire Safety Insights from Microgravity Combustion Data** *An Interactive Web Platform for Exploring, Filtering, and Interpreting NASA Microgravity Combustion Investigations*

**Team LuminarX** · [Web application](#web-application) · [Sources](#sources)

---

## Overview

LuminarX is a two-person team taking part in the NASA Space Apps Challenge 2026\. *Flame in Freefall* is our web prototype for working with NASA microgravity combustion investigations. It combines an **interactive dashboard** with an **AI chatbot**, built on an initial corpus of **24 investigations** from NASA Physical Sciences Informatics (PSI).

The tool is an interactive aid for exploring, filtering, querying and interpreting NASA combustion data. It is not a fire-risk prediction model, and it does not replace the original data or a researcher's judgement.

## The Challenge

The challenge is *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*.

NASA has run many investigations on solid, liquid and gaseous fuels, droplets, flame spread, extinction, cool flames, soot, smoke, smoke detection and larger-scale fires, and part of this knowledge is available through PSI. The problem is not a lack of data. It is how hard it is to:

- find the relevant investigations;  
- understand their characteristics;  
- filter them by scientific criteria;  
- judge whether several investigations are actually comparable;  
- interpret what the information means for spacecraft fire safety;  
- keep a link back to the original data and sources.

## Our Solution

We built a web application with two complementary ways of working with the corpus:

```
Scientific question → Dashboard exploration / Chatbot query → Relevant investigations → Synthesis → Sources
```

The dashboard gives the user explicit control over which investigations are selected. The chatbot lets the user ask questions in natural language. AI acts as an assistance layer on top of the data, not as a substitute for it.

## Key Features

### Interactive Dashboard

- Explore the corpus of 24 investigations.  
- Narrow it down with filters based on the information available for each investigation (for example fuel state, phenomenon, gravity conditions, experimental conditions, measured quantities and data types).  
- Examine the characteristics of the retained investigations before interpreting anything.

### AI Chatbot

- Ask questions in natural language, without needing to know the data structure or investigation identifiers.  
- Answers are built from the information associated with the investigations in the corpus. The chatbot is more than a search engine, but it is not an autonomous scientific reasoner.

### Scientific Traceability

- Traceability is a core design principle: answers are meant to stay tied to the investigations and sources used to produce them.  
- Experimental conditions, results and interpretations are kept distinct, so that a generated answer is never mistaken for evidence in itself.

## Data

- **Source:** NASA Physical Sciences Informatics (PSI).  
- **Corpus:** 24 investigations, each described by its phenomenon, experimental conditions, fuels or materials, measured quantities and documentary resources.  
- **Data types met in the investigations:** experimental measurements, images, videos, telemetry, metadata, published results and numerical simulation results.  
- **Comparability:** we built a first internal compatibility matrix with three levels (0: no direct comparison identified; 1: possible relationship needing validation or harmonisation; 2: relevant comparison in a defined experimental context). **This is an internal project convention, not an official NASA classification.**

## Scientific Scope

The initial corpus contains the following PSI investigations:

`PSI-10`, `PSI-20`, `PSI-21`, `PSI-22`, `PSI-23`, `PSI-25`, `PSI-26`, `PSI-39`, `PSI-47`, `PSI-60`, `PSI-62`, `PSI-68`, `PSI-69`, `PSI-98`, `PSI-99`, `PSI-100`, `PSI-101`, `PSI-102`, `PSI-106`, `PSI-107`, `PSI-115`, `PSI-117`, `PSI-142`, `PSI-159`

They cover solid, liquid (including droplets) and gaseous fuels, and phenomena such as ignition, flame growth and spread, extinction, burning rates, cool flames, soot, radiative losses, smoke production and transport, smoke detector response and larger-scale fires.

This selection is our initial working scope. **It is not an exhaustive list of NASA combustion research.**

## Limitations

- **Comparison is assisted, not automated.** Within the challenge time frame, the model could not be specialised enough to compare investigations autonomously and reliably. In-depth comparison remains under the user's examination and judgement.  
- **Answers depend on the corpus.** Chatbot answers depend on the coverage, structure and quality of the available data and on the underlying model. Missing information does not mean a phenomenon is absent.  
- **No quantitative validation yet.** No accuracy, benchmark, response-time or user-study results are reported. Results to date are functional and qualitative.  
- **Not a universal risk model.** Insights apply only to the experimental conditions covered by the data and must be checked against the original investigations and sources.

## Project Structure

The project is organised around three building blocks:

| Component | Role |
| :---- | :---- |
| Structured investigation corpus | Information on the 24 investigations, shared by the dashboard and the chatbot |
| Dashboard | Exploration and filtering of the corpus |
| Chatbot | Natural-language questions answered from the corpus |

> **To complete:** add the repository folder layout here.

## Sources

1. NASA, *Physical Sciences Informatics (PSI)*.  
2. NASA Space Apps Challenge 2026, *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*.  
3. NASA Physical Sciences Informatics, *Combustion Science Investigations*.  
4. NASA Glenn Research Center, *Combustion Science*.  
5. NASA, *A Researcher's Guide to Combustion Science*.  
6. NASA Physical Sciences Informatics, pages and resources of the 24 investigations listed above.

## Web Application

**Web Application:** https\://nasaspaceapps.vercel.app

## Team

**LuminarX**

- KISEME KIKALULU Merdi  
- LIWOSO BOKANIA Joël Junior

*AI use:* artificial intelligence was used as an assistive tool for research, analysis, data structuring, writing and development. Scientific choices, validation, interpretation and final decisions remain the team's.