
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Flame,
  FlaskConical,
  Search,
  ShieldCheck,
  Atom,
  X,
} from "lucide-react";

/* =========================================================
   INVESTIGATION DATA
   Les résumés sont directement intégrés aux investigations.
   Les métadonnées inconnues ne sont pas affichées.
========================================================= */

const investigations = [
  {
    id: "fm2",
    title: "Flammability of Materials on the Moon",
    acronym: "FM²",
    category: "Lunar Combustion",
    status: "Current",

    description:
      "Understanding how materials ignite and burn under the Moon's reduced gravity.",

    summary: `Fire does not behave in exactly the same way everywhere. On Earth, gravity causes hot air and combustion gases to rise. This movement creates a continuous flow around a flame: hot gases move upward while cooler air containing oxygen is drawn toward the flame. This process influences how a fire develops, how much oxygen it receives and how quickly it spreads.

On the Moon, gravity is approximately six times weaker than on Earth. This changes the natural movement of gases around a flame and can modify the way materials burn. A material that has passed a safety test on Earth may therefore behave differently in a lunar environment.

The Flammability of Materials on the Moon (FM²) investigation focuses on this problem. It studies the burning behavior of solid materials under lunar gravity, examining how a flame starts, how it develops across a material and the conditions that allow combustion to continue or stop.

NASA's research includes experiments involving materials representative of those that could be used in future lunar habitats. Scientists want to understand whether reduced gravity changes the conditions required for ignition and flame propagation.

Why does this matter? Future astronauts will live inside enclosed lunar habitats containing fabrics, insulation, cables, equipment and other materials. If one of these materials catches fire, the consequences could be serious. Understanding its behavior before a mission helps engineers choose safer materials, improve fire-prevention procedures and prepare better emergency responses.

FM² therefore addresses a fundamental question for future lunar exploration: how can humans safely live and work in an environment where fire behaves differently from the way it does on Earth?`,

    objective:
      "Characterize the flammability and flame-spread behavior of materials under lunar gravity to improve material selection and fire safety for future lunar missions.",

    results: {
      status: "Preliminary",
      findings: [
        "Research on reduced-gravity combustion indicates that lower buoyancy changes the movement of hot gases around a flame.",
        "Previous experiments suggest that the conditions for ignition and flame propagation can differ between Earth gravity and lunar gravity.",
        "The investigation is intended to provide experimental measurements under lunar gravity conditions. These should not be confused with final results from experiments performed on the Moon.",
      ],
    },

    elements: [
      "Material ignition under lunar gravity",
      "Flame propagation across solid materials",
      "Influence of reduced gravity on combustion",
      "Evaluation of materials for lunar habitats",
      "Fire prevention for future Moon missions",
    ],

    image:
      "https://www.nasa.gov/wp-content/uploads/2025/07/edge-view-of-sibal.png",

    imageCaption:
      "NASA illustration of a fabric sample burning in simulated lunar gravity.",

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "sofie",
    title: "Solid Fuel Ignition and Extinction",
    acronym: "SoFIE",
    category: "Solid Fuels",
    status: "Current",

    description:
      "Investigating how solid materials ignite, burn, spread flames and become extinguished in reduced gravity.",

    summary: `Fire is one of the major hazards that must be controlled during a space mission. Inside a spacecraft, astronauts are surrounded by materials that can potentially burn: fabrics, insulation, equipment, cables and structural components. A fire that develops in such a confined environment could threaten the crew and the entire mission.

However, the behavior of fire in space is different from its behavior on Earth. Under normal gravity, hot combustion gases rise and create a flow of air around the flame. In microgravity, this natural convection is greatly reduced. The flame may have a different shape, receive oxygen differently and spread under conditions that are not easy to reproduce in a conventional laboratory.

The Solid Fuel Ignition and Extinction (SoFIE) investigation was developed to study how solid spacecraft materials ignite and burn in reduced gravity. It uses an experimental facility installed inside the Combustion Integrated Rack aboard the International Space Station.

Researchers can investigate different conditions, including oxygen concentration, pressure, airflow and the characteristics of the material being tested. By changing these parameters, they can determine which conditions make ignition easier, encourage flame propagation or cause a fire to extinguish.

The investigation is particularly useful because NASA must evaluate materials before allowing them to be used in spacecraft. A material that behaves safely in an ordinary laboratory may not necessarily behave the same way in a low-gravity environment.

SoFIE provides experimental data that can improve the scientific models used to predict material flammability. It also contributes to the development of better fire-suppression techniques and safer material-selection procedures.

The ultimate objective is to protect astronauts during long-duration missions, especially future journeys to the Moon and Mars, where fire prevention and emergency response will be essential.`,

    objective:
      "Understand the ignition, flame propagation and extinction of solid materials in reduced gravity, and improve the methods used to evaluate and control fire hazards in spacecraft.",

    results: {
      status: "Published",
      findings: [
        "SoFIE-GEL experiments investigated the combustion of solid PMMA spheres under different oxygen concentrations, pressures and airflow conditions.",
        "Measurements showed that flame behavior and flame length depend strongly on the surrounding flow conditions.",
        "The experiments provide data for improving models of solid-fuel ignition, flame growth and extinction in reduced gravity.",
      ],
    },

    elements: [
      "Ignition of solid materials",
      "Flame propagation and growth",
      "Influence of oxygen concentration",
      "Influence of pressure and airflow",
      "Flame extinction and fire suppression",
      "Validation of material-flammability models",
    ],

    image:
      "https://images-assets.nasa.gov/image/jsc2023e013681/jsc2023e013681~orig.jpg",

    imageCaption:
      "NASA research involving solid-fuel combustion and spacecraft fire safety.",

    source:
      "https://science.nasa.gov/biological-physical/investigations/sofie/",
  },

  {
    id: "flare",
    title: "Flammability Limits at Reduced-g Experiment",
    acronym: "FLARE",
    category: "Fire Safety",
    status: "Current",

    description:
      "Investigating how reduced gravity changes the conditions under which materials can ignite and continue burning.",

    summary: `Before a fire can develop, several physical and chemical conditions must be satisfied. A material needs to reach an appropriate temperature, sufficient oxygen must be available and the combustion process must be able to sustain itself.

Scientists use the concept of flammability limits to describe the conditions under which a flame can continue burning. These limits are important because they help engineers determine when an atmosphere or material presents a fire hazard.

On Earth, gravity strongly influences the movement of hot gases around a flame. Hot combustion products rise, while fresh air moves toward the burning region. This natural circulation affects heat transfer, oxygen supply and flame stability.

In reduced gravity, this movement changes significantly. A flame may receive oxygen differently, lose heat at a different rate or remain stable under conditions that would produce a different result on Earth.

The Flammability Limits at Reduced-g Experiment (FLARE) investigates these differences. Its purpose is to understand how the conditions required for ignition and sustained combustion change in a microgravity environment.

This research is particularly relevant to spacecraft because the atmosphere inside a vehicle can differ from the atmosphere found on Earth. Pressure, oxygen concentration, ventilation and the materials used inside the vehicle all influence the risk of fire.

By improving the understanding of flammability limits, researchers can help engineers determine which environmental conditions are safer and which combinations of materials and atmospheric conditions should be avoided.

The results contribute to the development of more reliable fire-safety standards and better methods for evaluating the risks associated with future human spaceflight missions.`,

    objective:
      "Improve the understanding of material flammability and the conditions that allow combustion to start and continue in reduced-gravity environments.",

    results: {
      status: "Partial",
      findings: [
        "The research investigates how flammability limits change when buoyancy-driven airflow is reduced.",
        "The experimental approach combines terrestrial tests and reduced-gravity experiments to improve the prediction of material flammability.",
        "The available information does not establish a complete set of final quantitative results for the investigation.",
      ],
    },

    elements: [
      "Flammability limits",
      "Ignition and sustained combustion",
      "Influence of gravity on flame behavior",
      "Atmospheric conditions and fire risk",
      "Spacecraft fire-safety assessment",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "acme",
    title: "Advanced Combustion via Microgravity Experiments",
    acronym: "ACME",
    category: "Gaseous Combustion",
    status: "Archived",

    description:
      "A series of microgravity experiments designed to understand gaseous flames, improve combustion efficiency and reduce pollutant emissions.",

    summary: `Combustion is used in many technologies on Earth, including engines, industrial burners, heating systems and power-generation equipment. Although these systems are essential, they can consume large quantities of fuel and produce pollutants such as soot and other undesirable emissions.

To improve these systems, scientists need to understand exactly how flames develop, how fuel reacts with oxygen and what determines whether combustion remains stable or becomes inefficient.

The Advanced Combustion via Microgravity Experiments (ACME) program was designed to investigate these questions using the microgravity environment of the International Space Station. Instead of relying only on experiments conducted on Earth, researchers studied gaseous flames under conditions where the influence of gravity is greatly reduced.

ACME brought together several independent experiments, each focusing on a particular aspect of combustion. These investigations examined flame structure, soot production, flame stability, combustion efficiency and the influence of electric fields on flames.

One important subject was the behavior of non-premixed flames. In this type of combustion, fuel and oxidizer are not completely mixed before burning. They meet and react in the region where the flame develops. Understanding this process helps scientists predict how flames behave under different operating conditions.

Another important subject was soot formation. Soot consists of tiny carbon-rich particles produced during incomplete combustion. It contributes to air pollution and can affect the performance of combustion equipment. By understanding how soot forms, engineers can develop systems that produce fewer unwanted emissions.

ACME also investigated the use of electric fields to influence flame behavior. This approach is scientifically interesting because it may provide additional ways to control combustion.

The microgravity environment helps researchers observe certain processes without the strong influence of buoyancy-driven airflow. This provides experimental measurements that can be compared with computer simulations and used to improve combustion models.

Although much of ACME's research focuses on applications on Earth, one of its investigations, the Burning Rate Emulator, also addresses spacecraft fire prevention and material flammability.

The program therefore has two major benefits: helping engineers develop more efficient and less polluting combustion technologies on Earth, while improving scientific knowledge that can contribute to fire safety in space.`,

    objective:
      "Improve fundamental knowledge of gaseous flames to support more efficient combustion, lower pollutant emissions and better understanding of material flammability.",

    results: {
      status: "Published",
      findings: [
        "Microgravity experiments revealed important differences in flame structure compared with combustion under normal gravity.",
        "Some experiments observed significantly increased soot concentrations under specific combustion conditions.",
        "Researchers investigated how fuel dilution influences flame stability and soot formation.",
        "The results provide experimental data for improving combustion models and developing cleaner combustion technologies.",
      ],
    },

    elements: [
      "Gaseous non-premixed flames",
      "Flame structure and stability",
      "Soot formation and reduction",
      "Combustion efficiency",
      "Electric-field effects on flames",
      "Combustion modeling and simulation",
      "Spacecraft material flammability",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://science.nasa.gov/biological-physical/investigations/acme/",
  },

  {
    id: "bass",
    title: "Burning and Suppression of Solids",
    acronym: "BASS",
    category: "Solid Fuels",
    status: "Archived",

    description:
      "Examining how different solid materials burn and how their flames can be extinguished in microgravity.",

    summary: `When a solid material catches fire, the combustion process does not necessarily remain limited to the point where ignition occurred. Heat from the flame can warm nearby parts of the material, causing them to release combustible gases. These gases mix with oxygen and can produce new flames, allowing the fire to spread.

The speed and intensity of this process depend on several factors: the type of material, its shape, its thickness, the surrounding atmosphere and the way heat moves through the environment.

The Burning and Suppression of Solids (BASS) investigation studies these processes in microgravity. It examines the burning and extinction characteristics of different solid fuel samples to understand how flames behave when the natural movement of hot gases caused by gravity is reduced.

On Earth, buoyancy causes hot gases to rise and influences the way heat is transferred to nearby material. In microgravity, this mechanism is greatly weakened. Consequently, the flame may spread differently and the conditions required to maintain combustion may change.

BASS allows researchers to observe these differences and compare the behavior of solid fuels under different conditions. The investigation also contributes to understanding how fires can be suppressed when they occur in a spacecraft.

This is important because astronauts cannot simply rely on the same assumptions used for ordinary fires on Earth. A fire-suppression method that works in a terrestrial environment may not produce exactly the same effect in microgravity.

The knowledge obtained from BASS helps researchers understand the relationship between material properties, flame propagation and extinction. It can also improve the scientific models used to predict the behavior of solid materials during combustion.

Ultimately, this research contributes to safer spacecraft design, better material selection and more effective fire-response procedures for future space missions.`,

    objective:
      "Understand the burning and extinction characteristics of solid materials in microgravity and improve knowledge of fire suppression in spacecraft.",

    results: {
      status: "Published",
      findings: [
        "Experiments observed the combustion behavior of solid fuels under microgravity conditions.",
        "Researchers investigated how material properties and environmental conditions influence flame propagation.",
        "The experiments contributed to understanding how nitrogen injection can be used to suppress flames.",
        "The collected measurements support the development and validation of solid-fuel combustion models.",
      ],
    },

    elements: [
      "Combustion of solid materials",
      "Flame propagation across solid fuels",
      "Material properties and burning behavior",
      "Flame extinction",
      "Fire suppression in microgravity",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "daft",
    title: "Dust and Aerosol Measurement Feasibility Test",
    acronym: "DAFT",
    category: "Smoke and Aerosols",
    status: "Archived",

    description:
      "Testing whether aerosol-measurement equipment can operate reliably in the microgravity environment of the International Space Station.",

    summary: `When a fire burns, it can release smoke containing thousands or millions of microscopic particles. These particles are called aerosols. Their size, concentration and physical properties depend on the material being burned and the conditions under which combustion takes place.

Measuring these particles is important for understanding smoke behavior and developing reliable fire-detection systems. However, measuring aerosols in space is more complicated than performing the same operation on Earth.

On Earth, gravity influences how airborne particles move and settle. Inside a spacecraft, the movement of particles is affected by ventilation, air circulation and the reduced influence of gravity. An instrument designed for terrestrial measurements must therefore be evaluated before it can be used reliably in a microgravity environment.

The Dust and Aerosol Measurement Feasibility Test (DAFT) was designed to evaluate a modified P-Trak aerosol measurement instrument. This instrument was intended to support the Smoke Aerosol Measurement Experiment (SAME), which studies the characteristics of smoke produced by different materials.

DAFT focused on the ability of the equipment to function properly under the unusual conditions of the International Space Station. Researchers needed to determine whether the instrument could collect useful measurements and operate reliably in microgravity.

This type of preliminary experiment is important in scientific research. Before using an instrument to draw conclusions about a physical phenomenon, researchers must first verify that the instrument itself works correctly in the environment where measurements will be collected.

DAFT therefore contributed to the development of experimental capabilities needed to study smoke and airborne particles in space. Its work supported further research into aerosol behavior and spacecraft fire detection.

The broader benefit is improved knowledge of how smoke can be measured and monitored in an environment where conventional assumptions about particle movement may no longer apply.`,

    objective:
      "Evaluate the performance of modified aerosol-measurement equipment in microgravity to support scientific investigations of smoke particles in space.",

    results: {
      status: "Published",
      findings: [
        "The investigation evaluated the performance of aerosol-measurement equipment aboard the International Space Station.",
        "The measurements helped characterize airborne particles in the station environment.",
        "The experiment supported the development of measurement techniques used in subsequent smoke-aerosol investigations, including SAME.",
      ],
    },

    elements: [
      "Aerosol measurement",
      "Microscopic airborne particles",
      "Instrument performance in microgravity",
      "Smoke characterization",
      "Preparation for the SAME investigation",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "flex",
    title: "Flame Extinguishment Experiment",
    acronym: "FLEX",
    category: "Flame Suppression",
    status: "Archived",

    description:
      "Investigating how liquid-fuel flames behave and how effectively inert gases can extinguish them in microgravity.",

    summary: `Extinguishing a fire requires more than simply removing the visible flame. Combustion is a chemical process that depends on the interaction between fuel, oxygen, temperature and the surrounding environment.

On Earth, firefighters commonly use water, foam or other fire-suppression agents depending on the type of fire. In a spacecraft, however, the behavior of flames and fire-suppressing substances can be different because gravity has a much smaller influence on the movement of gases and liquids.

The Flame Extinguishment Experiment (FLEX) was designed to investigate the effectiveness of inert-gas suppressants in microgravity. Inert gases are substances that can reduce the availability of oxygen around a flame and interfere with the chemical conditions required to maintain combustion.

Researchers studied liquid-fuel droplets burning in a controlled experimental environment. By observing the flames and varying the surrounding conditions, they could investigate how combustion develops and under which conditions the flame becomes extinguished.

One particularly important aspect of FLEX was the study of combustion near its extinction limit. Scientists discovered that under certain conditions, a visible flame could disappear while chemical reactions continued in a much cooler form. This phenomenon is known as cool-flame combustion.

Unlike the familiar hot flames that produce strong visible light, cool flames involve different chemical reactions and can produce different combustion products. Microgravity makes it possible to observe some of these reactions for longer periods than would normally be possible on Earth.

These findings expanded scientific understanding of combustion and demonstrated that the disappearance of a visible flame does not always mean that all chemical reactions have stopped.

FLEX therefore contributes to two important areas of research: improving the effectiveness of fire-suppression systems for spacecraft and understanding fundamental combustion processes that may also help engineers develop more efficient and less polluting technologies on Earth.`,

    objective:
      "Evaluate the effectiveness of inert-gas fire suppressants in microgravity and investigate combustion behavior near flame-extinction conditions.",

    results: {
      status: "Published",
      findings: [
        "Researchers observed that liquid-fuel droplets could continue undergoing chemical reactions after the visible flame disappeared.",
        "The investigation contributed to the discovery of non-premixed cool flames in microgravity.",
        "This discovery demonstrated that the disappearance of visible combustion does not necessarily mean that all chemical reactions have stopped.",
        "The findings opened new research opportunities in low-temperature combustion chemistry.",
      ],
    },

    elements: [
      "Liquid-fuel droplet combustion",
      "Inert-gas fire suppression",
      "Flame extinction limits",
      "Oxygen concentration and combustion",
      "Cool-flame chemistry",
      "Spacecraft fire-safety strategies",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "saffire",
    title: "Spacecraft Fire Safety Demonstration",
    acronym: "SAFFIRE",
    category: "Spacecraft Fire Safety",
    status: "Archived",

    description:
      "Studying larger-scale fires inside uncrewed cargo spacecraft to improve fire-safety knowledge for future missions.",

    summary: `Most fire experiments conducted aboard the International Space Station must be carefully controlled because astronauts are living and working inside the same spacecraft. This makes it difficult to perform experiments involving large flames or realistic fire scenarios.

However, understanding how a larger fire develops inside a spacecraft is essential. Small laboratory flames provide useful scientific information, but they cannot reproduce every aspect of a fire spreading across a larger material or inside a confined vehicle.

The Spacecraft Fire Safety Demonstration (SAFFIRE) program was developed to address this challenge. It consists of a series of experiments conducted inside uncrewed Cygnus cargo spacecraft after they have departed from the International Space Station.

Because the cargo vehicles are no longer attached to the station and do not carry astronauts during these experiments, researchers can investigate larger fire scenarios without directly exposing the station's crew to the experiment.

The investigations examine how flames develop and spread across solid materials in a spacecraft-like environment. Researchers collect measurements and images to understand flame propagation, the influence of airflow and the way environmental conditions affect the development of a fire.

The experiments are particularly valuable because fire behavior in microgravity can differ significantly from behavior on Earth. Without the usual buoyancy-driven movement of hot gases, flames may spread in unexpected ways and smoke may move differently through the vehicle.

The results help researchers improve computer models that predict fire growth and heat release. These models are important for evaluating how quickly a fire could develop and for determining what measures are necessary to protect a spacecraft and its crew.

SAFFIRE is particularly relevant to future long-duration missions. Astronauts travelling to the Moon or Mars will spend extended periods inside enclosed habitats, far from immediate assistance on Earth.

Understanding larger fire scenarios can therefore help engineers design safer spacecraft, improve detection systems and develop more effective fire-prevention and emergency-response procedures.`,

    objective:
      "Investigate larger-scale fire behavior in uncrewed spacecraft to improve understanding of flame spread, heat release and fire hazards during space missions.",

    results: {
      status: "Published",
      findings: [
        "The experiments provided observations of flame propagation across solid materials inside uncrewed cargo spacecraft.",
        "Researchers demonstrated that fire behavior depends on material properties and airflow conditions.",
        "The experiments showed that the extinction behavior of some materials cannot simply be predicted from observations made under normal terrestrial conditions.",
        "The collected data support the improvement of spacecraft fire-growth models and fire-safety strategies.",
      ],
    },

    elements: [
      "Larger-scale fire experiments",
      "Flame propagation across solid materials",
      "Fire behavior inside enclosed spacecraft",
      "Heat-release measurements",
      "Fire-growth modeling",
      "Spacecraft fire prevention",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/",
  },

  {
    id: "same",
    title: "Smoke Aerosol Measurement Experiment",
    acronym: "SAME",
    category: "Smoke Detection",
    status: "Archived",

    description:
      "Studying the particles produced by smoke to improve the understanding and detection of fires in spacecraft.",

    summary: `Smoke is one of the earliest signs that a fire may be developing. Detecting it quickly is essential, especially inside a spacecraft where a fire could threaten astronauts, equipment and the entire mission.

However, smoke is not a uniform substance. It contains microscopic particles whose size, concentration and composition depend on the material being burned. Different materials can produce different types of smoke, and these differences influence how the particles move and how they can be detected.

The Smoke Aerosol Measurement Experiment (SAME) was designed to study the characteristics of smoke aerosols generated by different burning materials. Its purpose is to improve scientific knowledge of the particles released during combustion.

This research is particularly important in microgravity. On Earth, hot smoke generally rises because it is less dense than the surrounding air. This natural movement influences how smoke spreads through a room and how it reaches smoke detectors.

Inside a spacecraft, the usual buoyancy-driven movement is greatly reduced. Smoke particles can therefore move differently, depending more strongly on ventilation and other airflow conditions. A smoke detector designed using only terrestrial assumptions may not always behave in the same way in space.

By measuring and comparing smoke aerosols, researchers can better understand the relationship between the material being burned and the characteristics of the smoke it produces.

These measurements can support the development and evaluation of spacecraft smoke-detection systems. They can also help scientists improve models that predict how smoke particles spread in microgravity.

The investigation addresses a fundamental safety question: how can astronauts detect a fire early and reliably when smoke does not necessarily behave as it does inside a building on Earth?`,

    objective:
      "Characterize smoke aerosols produced by different materials and improve the scientific basis for smoke detection in microgravity environments.",

    results: {
      status: "Published",
      findings: [
        "The experiments characterized smoke particles generated by different materials.",
        "Measurements provided information about particle concentration and size distribution in microgravity.",
        "Researchers observed that particle characteristics can change with time and environmental airflow conditions.",
        "The findings contribute to the development of more reliable smoke-detection systems for spacecraft.",
      ],
    },

    elements: [
      "Smoke-particle characteristics",
      "Aerosol size and concentration",
      "Smoke production by different materials",
      "Particle movement in microgravity",
      "Spacecraft smoke-detection systems",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "slice",
    title: "Structure and Liftoff in Combustion Experiment",
    acronym: "SLICE",
    category: "Gaseous Combustion",
    status: "Archived",

    description:
      "Investigating the structure and stability of gaseous diffusion flames in microgravity.",

    summary: `A flame is not simply a visible region of light. It is a complex physical and chemical process in which fuel reacts with an oxidizer and releases heat. The shape and stability of the flame depend on how these substances move, mix and react.

One important type of flame is the diffusion flame. In this configuration, fuel and oxidizer are supplied separately and meet in the region where combustion occurs. This type of flame is found in several practical combustion systems and is widely studied by combustion scientists.

The Structure and Liftoff in Combustion Experiment (SLICE) investigates laminar diffusion flames under microgravity conditions. A laminar flame is one in which the flow is relatively smooth and organized rather than dominated by turbulent motion.

One of the important subjects of the investigation is flame stability. A flame must remain in a suitable position and receive the necessary conditions to continue burning. If the flow conditions change, the flame may move away from the burner. This behavior is known as flame liftoff.

Researchers study how the structure of the flame changes and what conditions influence its attachment to the burner or its movement away from it.

Microgravity is useful for this research because it reduces the influence of buoyancy. On Earth, hot gases rise and influence the shape and movement of a flame. When this effect is reduced, scientists can observe certain combustion processes more clearly.

The experimental observations help improve scientific models used to describe flame structure, stability and extinction. These models are important for understanding combustion systems and predicting how flames behave under different conditions.

SLICE therefore contributes to fundamental combustion research and provides information that can support the development of more accurate combustion simulations and improved engineering designs.`,

    objective:
      "Study the structure and stability of laminar diffusion flames in microgravity, with particular attention to the conditions that cause flames to remain attached or lift away from a burner.",

    results: {
      status: "Partial",
      findings: [
        "The experimental approach investigates the structure and stability of laminar diffusion flames.",
        "Researchers use controlled airflow variations to study the transition between attached and lifted flames.",
        "The available information describes the experimental approach and preliminary work but does not establish a complete set of final quantitative findings.",
      ],
    },

    elements: [
      "Laminar diffusion flames",
      "Flame structure",
      "Flame stability",
      "Flame liftoff",
      "Influence of reduced gravity",
      "Combustion modeling",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },

  {
    id: "spice",
    title: "Smoke Point in Coflow Experiment",
    acronym: "SPICE",
    category: "Soot Formation",
    status: "Archived",

    description:
      "Studying soot formation and smoke-point behavior in laminar diffusion flames.",

    summary: `When certain fuels burn, they can produce soot: tiny particles made mainly of carbon that form during incomplete combustion. Soot is responsible for the visible black smoke associated with some flames and can contribute to air pollution and health problems.

The amount of soot produced depends on several factors, including the type of fuel, the temperature of the flame, the availability of oxygen and the way gases move around the combustion region.

The Smoke Point in Coflow Experiment (SPICE) investigates soot formation in laminar diffusion flames. It focuses on the smoke point, a characteristic used to describe the conditions at which a diffusion flame begins to produce visible soot.

In a coflow configuration, fuel exits through a central burner while another gas flows around it in the same general direction. The interaction between these flows influences the shape, length and behavior of the flame.

Researchers investigate how parameters such as burner geometry and the surrounding flow influence the flame and the formation of soot. By studying these processes under microgravity conditions, scientists can reduce the influence of buoyancy and examine the fundamental mechanisms that control soot production.

Understanding these mechanisms is important for combustion engineering. If scientists can better predict when and how soot forms, engineers may be able to design combustion systems that produce fewer unwanted particles.

SPICE also contributes to the development of scientific models that describe flame structure, smoke formation and combustion behavior. These models can help improve the design of engines, burners and other systems that rely on controlled combustion.

The investigation therefore connects fundamental research in microgravity with practical applications on Earth, particularly the development of cleaner and more efficient combustion technologies.`,

    objective:
      "Investigate the conditions that influence soot formation and smoke-point behavior in laminar diffusion flames under microgravity.",

    results: {
      status: "Published",
      findings: [
        "The investigation conducted 250 combustion experiments in microgravity.",
        "More than 70 smoke-point measurements were identified.",
        "The measurements provide information about the influence of burner geometry and co-flow velocity on flame behavior.",
        "The results contribute to understanding soot formation in non-buoyant diffusion flames.",
      ],
    },

    elements: [
      "Soot formation",
      "Smoke-point behavior",
      "Laminar diffusion flames",
      "Burner geometry and airflow",
      "Flame structure and stability",
      "Combustion modeling",
      "Reduction of unwanted emissions",
    ],

    image: null,
    imageCaption: null,

    source:
      "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },
];

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function StatusBadge({ status }) {
  const current = status === "Current";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        current
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          current ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-bold text-[#142B4A]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1769AA]">
        <Icon size={19} />
      </span>
      {children}
    </h3>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-left">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={17} />
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="mt-3 text-sm font-semibold text-[#142B4A]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INVESTIGATION CARD
========================================================= */

function InvestigationCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden bg-[#07172D]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-start bg-gradient-to-br from-[#07172D] via-[#103B65] to-[#087EAA] px-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <Flame size={34} className="text-cyan-300" />
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  NASA Research
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {item.acronym}
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Combustion Science
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1769AA]">
          <span>{item.acronym}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-500">{item.category}</span>
        </div>

        <h3 className="mt-3 text-left text-lg font-bold leading-snug text-[#142B4A]">
          {item.title}
        </h3>

        <p className="mt-3 text-left text-sm leading-6 text-slate-500">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 mt-5">
          <span className="text-sm font-semibold text-[#1769AA]">
            Explore investigation
          </span>

          <ArrowUpRight
            size={19}
            className="text-[#1769AA] transition group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   INVESTIGATION DETAIL
========================================================= */

function InvestigationDetail({ item, onBack }) {
  const paragraphs = item.summary.split("\n\n");

  return (
    <div className="w-full space-y-6 text-left">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1769AA] transition hover:text-blue-900"
      >
        <ArrowLeft size={18} />
        Back to investigations
      </button>

      {/* Main image and title */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-64 w-full bg-[#07172D] object-cover md:h-80"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-start bg-gradient-to-br from-[#07172D] via-[#103B65] to-[#087EAA] px-8 md:h-64">
            <div className="flex items-center gap-5">
              <Flame size={56} className="shrink-0 text-cyan-300" />

              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 md:text-sm">
                  NASA Combustion Science
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                  {item.acronym}
                </h2>
              </div>
            </div>
          </div>
        )}

        {item.imageCaption && (
          <p className="border-b border-slate-100 px-5 py-3 text-left text-xs leading-5 text-slate-500">
            {item.imageCaption}
          </p>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#1769AA]">
              {item.acronym}
            </span>

            <StatusBadge status={item.status} />

            <span className="text-sm text-slate-500">
              {item.category}
            </span>
          </div>

          <h1 className="mt-5 text-left text-2xl font-bold leading-tight text-[#142B4A] md:text-3xl">
            {item.title}
          </h1>

          <p className="mt-4 max-w-4xl text-left text-base leading-7 text-slate-600">
            {item.description}
          </p>
        </div>
      </div>

      {/* Detailed explanation */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <SectionTitle icon={FlaskConical}>
          Understanding the Investigation
        </SectionTitle>

        <div className="mt-6 space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${item.id}-paragraph-${index}`}
              className="text-left text-sm leading-7 text-slate-600 md:text-base md:leading-8"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Scientific objective */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <SectionTitle icon={Atom}>
          Scientific Objective
        </SectionTitle>

        <p className="mt-5 text-left text-sm leading-7 text-slate-600 md:text-base md:leading-8">
          {item.objective}
        </p>
      </section>

      {/* Research areas */}

      {item.elements?.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <SectionTitle icon={CheckCircle2}>
            Key Research Areas
          </SectionTitle>

          <ul className="mt-5 space-y-4">
            {item.elements.map((element, index) => (
              <li
                key={`${item.id}-element-${index}`}
                className="flex items-start gap-3 text-left text-sm leading-6 text-slate-600 md:text-base"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1769AA]" />
                <span>{element}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Scientific results */}

      {item.results && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <SectionTitle icon={Flame}>
            Scientific Results
          </SectionTitle>

          <div className="mt-5">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                item.results.status === "Published"
                  ? "bg-emerald-50 text-emerald-700"
                  : item.results.status === "Preliminary"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {item.results.status === "Published"
                ? "Published Results"
                : item.results.status === "Preliminary"
                ? "Preliminary Results"
                : "Partial Results"}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {item.results.findings.map((finding, index) => (
              <div
                key={`${item.id}-result-${index}`}
                className="flex items-start gap-3 text-left"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  {finding}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-sm leading-6 text-slate-600">
              <strong className="text-[#142B4A]">
                Scientific significance:
              </strong>{" "}
              These findings contribute to a better understanding of
              combustion behavior in reduced gravity and support the
              development of safer spacecraft and improved combustion
              technologies.
            </p>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Results presented here summarize selected findings. The
            labels indicate the level of information available in this
            catalogue and do not represent an official NASA investigation
            status.
          </p>
        </section>
      )}

      {/* Optional metadata */}

      {(item.year || item.duration || item.platform) && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {item.year && (
            <InfoCard
              icon={CalendarDays}
              label="Year"
              value={item.year}
            />
          )}

          {item.duration && (
            <InfoCard
              icon={Clock3}
              label="Duration"
              value={item.duration}
            />
          )}

          {item.platform && (
            <InfoCard
              icon={Atom}
              label="Platform"
              value={item.platform}
            />
          )}
        </section>
      )}

      {/* Optional investigators */}

      {item.investigators?.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <SectionTitle icon={FlaskConical}>
            Researchers and Institutions
          </SectionTitle>

          <ul className="mt-5 space-y-3">
            {item.investigators.map((person, index) => (
              <li
                key={`${item.id}-person-${index}`}
                className="flex items-start gap-3 text-left text-sm leading-6 text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1769AA]" />
                {person}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Scientific importance */}

      <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck
            size={25}
            className="mt-1 shrink-0 text-[#1769AA]"
          />

          <div className="text-left">
            <h3 className="text-lg font-bold text-[#142B4A]">
              Why does this research matter?
            </h3>

            <p className="mt-3 text-left text-sm leading-7 text-slate-600 md:text-base">
              Understanding combustion in reduced gravity helps scientists
              explain how fire behaves in environments beyond Earth. This
              knowledge supports safer spacecraft, better fire-detection
              systems and more reliable technologies for future human
              exploration.
            </p>
          </div>
        </div>
      </section>

      {/* NASA source */}

      {item.source && (
        <div className="flex justify-start">
          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D91] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#082F70]"
          >
            Explore NASA source
            <ExternalLink size={16} />
          </a>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Investigation() {
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const currentCount = investigations.filter(
    (item) => item.status === "Current"
  ).length;

  const archivedCount = investigations.filter(
    (item) => item.status === "Archived"
  ).length;

  const filteredInvestigations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return investigations.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.acronym.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === "All" || item.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-[#F8FAFD] text-left">
      <div className="w-full px-5 py-7 text-left md:px-8 md:py-9">

        {selected ? (
          <InvestigationDetail
            item={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <>
            {/* Page header */}

            <header className="w-full text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1769AA]">
                <Flame size={16} />
                NASA Physical Sciences
              </div>

              <h1 className="mt-4 text-left text-3xl font-bold tracking-tight text-[#142B4A] md:text-4xl">
                Combustion Investigations
              </h1>

              <p className="mt-4 max-w-3xl text-left text-sm leading-7 text-slate-500 md:text-base">
                Discover NASA's scientific investigations into flames,
                fire behavior and combustion in microgravity and reduced
                gravity. Explore the experiments, understand their
                objectives and learn how this research contributes to
                safer space exploration and better combustion technologies.
              </p>
            </header>

            {/* Statistics */}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <FlaskConical size={17} />
                  Selected investigations
                </div>

                <p className="mt-3 text-3xl font-bold text-[#142B4A]">
                  {investigations.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Flame size={17} />
                  Current
                </div>

                <p className="mt-3 text-3xl font-bold text-emerald-600">
                  {currentCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 size={17} />
                  Archived
                </div>

                <p className="mt-3 text-3xl font-bold text-[#142B4A]">
                  {archivedCount}
                </p>
              </div>
            </div>

            {/* Search and filters */}

            <section className="mt-10">
              <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-[#142B4A]">
                    Explore investigations
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select an investigation to discover its scientific
                    background and objectives.
                  </p>
                </div>

                <div className="relative w-full md:max-w-sm">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search investigations..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-left text-sm text-[#142B4A] outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-start gap-2">
                {["All", "Current", "Archived"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? "bg-[#0B3D91] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-[#1769AA]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </section>

            {/* Investigation cards */}

            {filteredInvestigations.length > 0 ? (
              <div className="mt-7 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredInvestigations.map((item) => (
                  <InvestigationCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelected(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-left">
                <Search size={28} className="text-slate-400" />

                <h3 className="mt-4 text-lg font-bold text-[#142B4A]">
                  No investigation found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search term or change the selected filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("All");
                  }}
                  className="mt-5 text-sm font-semibold text-[#1769AA] hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* NASA repository */}

            <footer className="mt-12 border-t border-slate-200 pt-6 text-left">
              <a
                href="https://psi.nasa.gov/physci/repo/search?q=combustion&data_source=psi&data_type=investigation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1769AA] hover:underline"
              >
                Explore NASA PSI combustion records
                <ExternalLink size={15} />
              </a>

              <p className="mt-3 max-w-3xl text-left text-xs leading-6 text-slate-400">
                This catalogue presents selected NASA combustion
                investigations. It does not represent the complete
                collection of combustion-related records available in
                the NASA Physical Sciences Informatics repository.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
