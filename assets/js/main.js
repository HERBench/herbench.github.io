// Minimal helpers: smooth scroll and copy feedback for BibTeX

document.addEventListener('DOMContentLoaded', () => {
  // initTaskModals(); 
});

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', evt => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      evt.preventDefault();
      const offset = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

function initCopy() {
  const bib = document.querySelector('.bibtex');
  if (!bib) return;
  bib.addEventListener('click', () => {
    const text = bib.innerText.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showCopied(bib));
    }
  });
}

function showCopied(el) {
  const original = el.dataset.copied;
  el.dataset.copied = 'Copied';
  setTimeout(() => {
    el.dataset.copied = original;
  }, 1800);
}

const TASKS = {
  // Temporal Reasoning & Chronology (TR&C)
  "TSO": {
    title: "Temporal Shot Ordering",
    family: "Temporal Reasoning & Chronology (TR&C)",
    desc: "Arrange four shot descriptions into the correct chronological order using content cues alone.",
    abilities: "Understanding event order, high-level scene transitions, chronological reconstruction using content cues",
    image: "assets/images/tasks_examples/TSO_example.webp"
  },
  "MPDR": {
    title: "Multi-Person Duration Reasoning",
    family: "Temporal Reasoning & Chronology (TR&C)",
    desc: "Comparing the duration of events involving different people or actions.",
    abilities: "Fine-grained time-span contrasts, interval statistics, comparing appearance durations across individuals",
    image: "assets/images/tasks_examples/MPDR_example.webp"
  },
  "ASII": {
    title: "Action Sequence Integrity & Identification",
    family: "Temporal Reasoning & Chronology (TR&C)",
    desc: "Identifying whether an action sequence is shown in reverse or has been tampered with.",
    abilities: "Micro-level task sequencing, action ordering, temporal understanding of fine-grained activities",
    image: "assets/images/tasks_examples/ASII_example2.webp"
  },
  // Referring & Tracking (R&T)
  "AGBI": {
    title: "Appearance-Grounded Behavior Interactions",
    family: "Referring & Tracking (R&T)",
    desc: "Tracking an object defined by its appearance while it interacts with others.",
    abilities: "Social and relational cues, identity maintenance across time, interaction recognition",
    image: "assets/images/tasks_examples/AGBI_example.webp"
  },
  "AGAR": {
    title: "Appearance-Grounded Attribute Recognition",
    family: "Referring & Tracking (R&T)",
    desc: "Recognizing attributes of an object re-entering the frame after occlusion.",
    abilities: "Moment-specific attribute extraction, target tracking, reading contextual details from specific individuals",
    image: "assets/images/tasks_examples/AGAR_example.webp"
  },
  "AGLT": {
    title: "Appearance-Grounded Localization Trajectory",
    family: "Referring & Tracking (R&T)",
    desc: "Long-term tracking and localization of specific entities across the entire video.",
    abilities: "Global path-level motion reasoning, trajectory tracking, spatial exit/entry point identification",
    image: "assets/images/tasks_examples/AGLT_example.webp"
  },
  // Global Consistency & Verification (GC&V)
  "FAM": {
    title: "False Action Memory",
    family: "Global Consistency & Verification (GC&V)",
    desc: "Verifying if a specific action actually occurred or if it's a distractor/hallucination.",
    abilities: "Action-level absence detection, exhaustive video-wide verification, distinguishing what did not occur",
    image: "assets/images/tasks_examples/FAM_example.webp"
  },
  "SVA": {
    title: "Scene Verification Arrangement",
    family: "Global Consistency & Verification (GC&V)",
    desc: "Verifying details about the scene arrangement, environment, or context.",
    abilities: "Shot-level fidelity checking, chronology verification, distinguishing real from fabricated descriptions",
    image: "assets/images/tasks_examples/SVA_example.webp"
  },
  "FOM": {
    title: "False Object Memory",
    family: "Global Consistency & Verification (GC&V)",
    desc: "Detecting if an object was present or if a sequence implies a false object interaction.",
    abilities: "Object-level absence detection, interaction verification, identifying non-interacted objects",
    image: "assets/images/tasks_examples/FOM_example.webp"
  },
  // Multi-Entity Aggregation & Numeracy (MEA&N)
  "MEGL": {
    title: "Multi-Entities Grounding & Localization",
    family: "Multi-Entity Aggregation & Numeracy (MEA&N)",
    desc: "Listing and localizing all entities of a certain type across the video.",
    abilities: "Set membership verification, identity deduplication, exact-match appearance verification",
    image: "assets/images/tasks_examples/MEGL_example.webp"
  },
  "AC": {
    title: "Action Counting",
    family: "Multi-Entity Aggregation & Numeracy (MEA&N)",
    desc: "Counting the number of occurrences of a specific action.",
    abilities: "Event-accumulation across dispersed moments, counting repeated actions, temporal aggregation",
    image: "assets/images/tasks_examples/AC_example.webp"
  },
  "RLPC": {
    title: "Region-Localized People Counting",
    family: "Multi-Entity Aggregation & Numeracy (MEA&N)",
    desc: "Counting people within a specific region or context.",
    abilities: "Region-conditioned identity aggregation, spatial partitioning, counting with spatial constraints",
    image: "assets/images/tasks_examples/RLPC_example.webp"
  }
};

function initTaskExplorer() {
  const taskMenu = document.getElementById('task-menu');
  const viewerTitle = document.getElementById('viewer-title');
  const viewerBadge = document.getElementById('viewer-badge');
  const viewerDesc = document.getElementById('viewer-desc');
  const viewerAbilities = document.getElementById('viewer-abilities');
  const viewerImg = document.getElementById('viewer-img');
  const viewerQuestion = document.getElementById('viewer-question');
  const viewerAnswer = document.getElementById('viewer-answer');

  // Initialize first task if elements exist
  if (taskMenu && viewerTitle) {
    renderTask('TSO');
  }

  // Event Delegation for Menu
  if (taskMenu) {
    taskMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('.task-menu-btn');
      if (!btn) return;

      const taskId = btn.dataset.task;
      renderTask(taskId);
    });
  }

  function renderTask(taskId) {
    const data = TASKS[taskId];
    if (!data) return;

    // Update Menu Active State
    document.querySelectorAll('.task-menu-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.task-menu-btn[data-task="${taskId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update Content
    viewerTitle.textContent = `${taskId}: ${data.title}`;
    viewerBadge.textContent = data.family;
    viewerDesc.textContent = data.desc;
    if (viewerAbilities) viewerAbilities.textContent = data.abilities;

    // Update Image
    if (data.image) {
      viewerImg.src = data.image;
      viewerImg.style.display = 'block';
      const placeholderOverlay = document.querySelector('.placeholder-overlay');
      if (placeholderOverlay) placeholderOverlay.style.display = 'none';
    } else {
      viewerImg.src = '';
      viewerImg.style.display = 'none';
    }

    // if (viewerQuestion) viewerQuestion.textContent = data.question;
    // if (viewerAnswer) viewerAnswer.textContent = data.answer;
  }
}

function initLeaderboardToggle() {
  const toggleBtn = document.getElementById('toggle-leaderboard');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const hiddenRows = document.querySelectorAll('.hidden-row');
    const isExpanded = toggleBtn.getAttribute('data-expanded') === 'true';

    hiddenRows.forEach(row => {
      row.style.display = isExpanded ? 'none' : 'table-row';
    });

    toggleBtn.textContent = isExpanded ? 'Show More' : 'Show Less';
    toggleBtn.setAttribute('data-expanded', !isExpanded);
  });
}

const initAll = () => {
  initSmoothScroll();
  initCopy();
  initTaskExplorer();
  initLeaderboardToggle();
  preloadImages();
  console.log('StreamVQA initialized');
};

function preloadImages() {
  Object.values(TASKS).forEach(task => {
    if (task.image) {
      const img = new Image();
      img.src = task.image;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
