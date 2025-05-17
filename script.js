
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('nav a');

  function throttle(fn, wait) {
    let time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
  }

  function onScroll() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let currentSectionId = sections[0].id;

    for (const section of sections) {
      if (scrollPos >= section.offsetTop) {
        currentSectionId = section.id;
      }
    }

    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(onScroll, 100));
  window.addEventListener('DOMContentLoaded', onScroll);

  // Profile form dynamic breed selectors for multiple fur babies
  const numFurBabiesInput = document.getElementById('numFurBabies');
  const additionalBreedsContainer = document.getElementById('additionalBreedsContainer');

  function createBreedDropdown(index) {
    const div = document.createElement('div');
    div.className = 'additional-breed';

    const label = document.createElement('label');
    label.setAttribute('for', 'catBreed' + index);
    label.textContent = `Fur Baby #${index} Breed:`;

    const select = document.createElement('select');
    select.id = 'catBreed' + index;
    select.name = 'catBreed' + index;
    select.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select breed';
    select.appendChild(defaultOption);

    const breeds = [
    "Abyssinian", "American Bobtail", "American Curl", "American Shorthair", "American Wirehair",
    "Balinese", "Bengal", "Birman", "Bombay", "British Shorthair", "Burmese", "Burmilla",
    "Chartreux", "Chausie", "Cornish Rex", "Devon Rex", "Egyptian Mau", "European Burmese",
    "Exotic Shorthair", "Havana Brown", "Himalayan", "Japanese Bobtail", "Korat", "LaPerm",
    "Maine Coon", "Manx", "Norwegian Forest", "Ocicat", "Oriental", "Persian", "Ragdoll",
    "Russian Blue", "Scottish Fold", "Siberian", "Singapura", "Snowshoe", "Somali",
    "Sphynx", "Tonkinese", "Turkish Angora", "Turkish Van"
  ];

    for (const breed of breeds) {
      const option = document.createElement('option');
      option.value = breed;
      option.textContent = breed;
      select.appendChild(option);
    }

    div.appendChild(label);
    div.appendChild(select);
    return div;
  }

  function updateBreedSelectors() {
    const number = parseInt(numFurBabiesInput.value, 10);
    additionalBreedsContainer.innerHTML = '';

    if (isNaN(number) || number < 1) {
      numFurBabiesInput.value = 1;
      return;
    }

    for (let i = 2; i <= number; i++) {
      const breedDropdown = createBreedDropdown(i);
      additionalBreedsContainer.appendChild(breedDropdown);
    }
  }

  numFurBabiesInput.addEventListener('change', updateBreedSelectors);
  // Initialize on page load
  window.addEventListener('DOMContentLoaded', updateBreedSelectors);

  // Profile form localStorage handling
  const profileForm = document.getElementById('profileForm');
  const profileSavedMsg = document.getElementById('profileSavedMsg');
  profileForm.addEventListener('submit', e => {
    e.preventDefault();
    const userName = document.getElementById('userName').value.trim();
    const catName = document.getElementById('profileCatName').value.trim();
    const catBreed1 = document.getElementById('catBreed').value;

    if (!userName || !catName) {
      alert('Please fill in at least your name and first cat\'s name.');
      return;
    }
    if (!catBreed1) {
      alert('Please select a breed for fur baby #1.');
      return;
    }

    const numFurBabies = parseInt(numFurBabiesInput.value, 10);
    const catDescriptions = document.getElementById('catDescriptionProfile').value.trim();

    const breeds = [catBreed1];
    for (let i = 2; i <= numFurBabies; i++) {
      const select = document.getElementById('catBreed' + i);
      if (!select || !select.value) {
        alert(`Please select a breed for fur baby #${i}.`);
        return;
      }
      breeds.push(select.value);
    }

    const profile = {
      userName,
      catNames: [catName], // Currently only one name input; can be extended if desired
      breeds,
      catAge: document.getElementById('catAge').value.trim(),
      catDescription: catDescriptions
    };
    localStorage.setItem('catConnectProfile', JSON.stringify(profile));
    profileSavedMsg.style.display = 'block';
    setTimeout(() => profileSavedMsg.style.display = 'none', 4000);
    profileForm.reset();
    updateBreedSelectors();
  });

  // Missing Cat form and poster generation code unchanged from previous version but omitted here for brevity...
  // You can append those unchanged parts from the last version as needed.

const missingCatForm = document.getElementById('missingCatForm');
const submissionMessage = document.getElementById('submissionMessage');
const posterMessage = document.getElementById('posterMessage');
const generatePosterBtn = document.getElementById('generatePosterBtn');
const postsContainer = document.getElementById('postsContainer');

function loadPosts() {
  postsContainer.innerHTML = ''; // Clear current list
  const posts = JSON.parse(localStorage.getItem('missingCatPosts') || '[]');

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p>No missing cats posted yet.</p>';
    return;
  }

  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('cat-post');
    postDiv.style.border = '1px solid #ccc';
    postDiv.style.padding = '12px';
    postDiv.style.marginBottom = '12px';
    postDiv.style.borderRadius = '8px';
    postDiv.style.background = '#fff8f0';

    postDiv.innerHTML = `
  <strong>${post.catName}</strong> (Last seen: ${post.lastSeenLocation})<br>
${post.photo ? `<img src="${post.photo}" alt="Photo of ${post.catName}" style="width: 180px; height: auto; float: right; margin-left: 12px; border-radius:6px; margin-bottom:10px;" />` : ''}
  Description: ${post.catDescription}<br>
  Fur Parent: ${post.ownerName}<br>
  Phone: ${post.contactPhone}<br>
  Email: ${post.contactEmail}<br>
  <small>Posted: ${new Date(post.timestamp).toLocaleString()}</small><br>
  <button data-index="${index}" class="deletePostBtn" style="margin-top:8px; background:#d9534f; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Delete Post</button>
`;

postsContainer.appendChild(postDiv);
  });

  // Add delete button listeners
  document.querySelectorAll('.deletePostBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      deletePost(idx);
    });
  });
}

function deletePost(index) {
  const posts = JSON.parse(localStorage.getItem('missingCatPosts') || '[]');
  posts.splice(index, 1);  // Remove the selected post
  localStorage.setItem('missingCatPosts', JSON.stringify(posts));
  loadPosts();
}

missingCatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const catName = document.getElementById('catName').value.trim();
  const catDescription = document.getElementById('catDescription').value.trim();
  const lastSeenLocation = document.getElementById('lastSeenLocation').value.trim();
  const ownerName = document.getElementById('ownerName').value.trim();
  const contactPhone = document.getElementById('contactPhone').value.trim();
  const contactEmail = document.getElementById('contactEmail').value.trim();
  const photoInput = document.getElementById('catPhoto');
  const photoFile = photoInput.files[0];

    if (!photoFile) {
    alert("Please upload a photo of your cat.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const photoDataURL = event.target.result;

  const post = {
    catName,
    catDescription,
    lastSeenLocation,
    ownerName,
    contactPhone,
    contactEmail,
    timestamp: new Date().toISOString(),
    photo: photoDataURL
  };

  const posts = JSON.parse(localStorage.getItem('missingCatPosts') || '[]');
    posts.push(post);
    localStorage.setItem('missingCatPosts', JSON.stringify(posts));

    submissionMessage.style.display = 'block';
    setTimeout(() => submissionMessage.style.display = 'none', 4000);
    missingCatForm.reset();
    loadPosts(); // Refresh UI
  };

  reader.readAsDataURL(photoFile); // Convert file to base64
});

// Poster generation code (same as before)...
generatePosterBtn.addEventListener('click', () => {
  const catName = document.getElementById('catName').value.trim();
  const catDescription = document.getElementById('catDescription').value.trim();
  const lastSeenLocation = document.getElementById('lastSeenLocation').value.trim();
  const ownerName = document.getElementById('ownerName').value.trim();
  const contactPhone = document.getElementById('contactPhone').value.trim();
  const contactEmail = document.getElementById('contactEmail').value.trim();

  if (!catName || !catDescription || !lastSeenLocation || !ownerName || !contactPhone || !contactEmail) {
    alert('Please fill in all required fields before generating the poster.');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff3e6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#d77700';
  ctx.font = 'bold 36px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MISSING CAT', canvas.width / 2, 60);

  ctx.fillStyle = '#442a1f';
  ctx.font = 'bold 28px Poppins, sans-serif';
  ctx.fillText(catName, canvas.width / 2, 120);

  ctx.fillStyle = '#4a3b27';
  ctx.textAlign = 'left';
  wrapText(ctx, `Description: ${catDescription}`, 40, 180, 520, 24);
  wrapText(ctx, `Last Seen: ${lastSeenLocation}`, 40, 260, 520, 24);
  wrapText(ctx, `Fur Parent: ${ownerName}`, 40, 340, 520, 24);
  wrapText(ctx, `Phone: ${contactPhone}`, 40, 380, 520, 24);
  wrapText(ctx, `Email: ${contactEmail}`, 40, 420, 520, 24);

  ctx.fillStyle = '#d77700';
  ctx.textAlign = 'center';
  ctx.font = 'italic 16px Poppins, sans-serif';
  ctx.fillText('Please contact if found!', canvas.width / 2, canvas.height - 40);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MissingCat_${catName.replace(/\s+/g, '_')}.png`;
    link.click();
    URL.revokeObjectURL(url);
    posterMessage.style.display = 'block';
    setTimeout(() => posterMessage.style.display = 'none', 4000);
  });
});

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

// Section toggle logic
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.getAttribute('data-target');
    const sections = document.querySelectorAll('main section');

    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));

    // Show only the selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update nav link active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Optional: Show the first section on load
document.addEventListener('DOMContentLoaded', () => {
  const defaultSection = document.querySelector('main section');
  if (defaultSection) {
    defaultSection.classList.add('active');
    document.querySelector(`.nav-link[data-target="${defaultSection.id}"]`)?.classList.add('active');
  }
});

