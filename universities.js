
// --- STUDENT VISA UNIVERSITIES -------------------------------------------
const UNIVERSITIES = {
    'USA': [
        { name: 'Massachusetts Institute of Technology (MIT)', rank: '#1 World', courses: ['Computer Science','Engineering','Business','AI & Robotics','Physics'] },
        { name: 'Stanford University', rank: '#2 World', courses: ['Data Science','Medicine','Law','MBA','Electrical Engineering'] },
        { name: 'Harvard University', rank: '#3 World', courses: ['Business Administration','Law','Public Health','Economics','Psychology'] },
        { name: 'Carnegie Mellon University', rank: '#2 CS', courses: ['Computer Science','AI','Software Engineering','Information Systems'] },
        { name: 'University of California Berkeley', rank: 'Top 10', courses: ['Engineering','Architecture','Finance','Environmental Science'] },
    ],
    'UK': [
        { name: 'University of Oxford', rank: '#1 UK', courses: ['Medicine','Law','Philosophy','History','Economics'] },
        { name: 'University of Cambridge', rank: '#2 UK', courses: ['Mathematics','Natural Sciences','Engineering','Computer Science'] },
        { name: 'Imperial College London', rank: '#3 UK', courses: ['Mechanical Engineering','Medicine','AI','Business','Physics'] },
        { name: 'University College London (UCL)', rank: 'Top 10 UK', courses: ['Architecture','Law','Biomedical Sciences','Finance'] },
        { name: 'London School of Economics (LSE)', rank: 'Top 5 UK', courses: ['Economics','Finance','Political Science','International Relations'] },
    ],
    'Canada': [
        { name: 'University of Toronto', rank: '#1 Canada', courses: ['Engineering','Medicine','Computer Science','MBA','Law'] },
        { name: 'University of British Columbia', rank: '#2 Canada', courses: ['Forestry','Environmental Science','Data Science','Business'] },
        { name: 'McGill University', rank: '#3 Canada', courses: ['Medicine','Law','Music','Architecture','Engineering'] },
        { name: 'University of Waterloo', rank: 'Top 5 Canada', courses: ['Computer Science','Software Engineering','AI','Mathematics'] },
        { name: 'McMaster University', rank: 'Top 10 Canada', courses: ['Health Sciences','Engineering','Business','Computer Science'] },
    ],
    'Australia': [
        { name: 'University of Melbourne', rank: '#1 Australia', courses: ['Medicine','Law','Engineering','Education','Architecture'] },
        { name: 'Australian National University', rank: '#2 Australia', courses: ['Political Science','Economics','International Relations','Science'] },
        { name: 'University of Sydney', rank: '#3 Australia', courses: ['Business','Law','Medicine','Engineering','Arts'] },
        { name: 'University of Queensland', rank: 'Top 5', courses: ['Veterinary Science','Mining Engineering','Biomedical Science','Agriculture'] },
        { name: 'Monash University', rank: 'Top 10', courses: ['Pharmacy','Nursing','Commerce','IT','Engineering'] },
    ],
    'Germany': [
        { name: 'Technical University of Munich (TUM)', rank: '#1 Germany', courses: ['Mechanical Engineering','Computer Science','MBA','Architecture','Physics'] },
        { name: 'LMU Munich', rank: '#2 Germany', courses: ['Medicine','Law','Economics','Psychology','Natural Sciences'] },
        { name: 'Heidelberg University', rank: '#3 Germany', courses: ['Medicine','Biochemistry','Law','Life Sciences'] },
        { name: 'Karlsruhe Institute of Technology', rank: 'Top 5', courses: ['Engineering','Computer Science','Mathematics','Physics'] },
    ],
    'France': [
        { name: 'Ecole Polytechnique', rank: '#1 France', courses: ['Engineering','Mathematics','Physics','Computer Science','Economics'] },
        { name: 'Sorbonne University', rank: 'Top 10', courses: ['Literature','History','Law','Medicine','Sciences'] },
        { name: 'HEC Paris', rank: '#1 Business FR', courses: ['MBA','Finance','Marketing','Strategy','Entrepreneurship'] },
    ],
    'Singapore': [
        { name: 'National University of Singapore (NUS)', rank: '#1 Asia', courses: ['Computer Science','Engineering','Business','Medicine','Law'] },
        { name: 'Nanyang Technological University', rank: '#2 Asia', courses: ['Engineering','Business','AI & Data Science','Education'] },
        { name: 'Singapore Management University', rank: 'Top Business', courses: ['Finance','Law','Information Systems','Business Analytics'] },
    ],
    'Japan': [
        { name: 'University of Tokyo', rank: '#1 Japan', courses: ['Engineering','Medicine','Science','Law','Economics'] },
        { name: 'Kyoto University', rank: '#2 Japan', courses: ['Science','Engineering','Medicine','Agriculture','Economics'] },
        { name: 'Osaka University', rank: '#3 Japan', courses: ['Medicine','Engineering','Science','International Studies'] },
    ],
    'New Zealand': [
        { name: 'University of Auckland', rank: '#1 NZ', courses: ['Engineering','Business','Medicine','Architecture','Computer Science'] },
        { name: 'Victoria University of Wellington', rank: '#2 NZ', courses: ['Law','Architecture','Computer Science','Government','Finance'] },
    ],
    'Ireland': [
        { name: 'Trinity College Dublin', rank: '#1 Ireland', courses: ['Computer Science','Business','Medicine','Law','Engineering'] },
        { name: 'University College Dublin', rank: '#2 Ireland', courses: ['Engineering','Commerce','Science','Agriculture','Arts'] },
    ],
    'Netherlands': [
        { name: 'Delft University of Technology', rank: '#1 Netherlands', courses: ['Architecture','Engineering','Computer Science','Aerospace'] },
        { name: 'University of Amsterdam', rank: '#2 Netherlands', courses: ['Business','Economics','Psychology','Law','Social Sciences'] },
    ],
    'Sweden': [
        { name: 'Karolinska Institute', rank: '#1 Sweden', courses: ['Medicine','Biomedicine','Public Health','Dentistry','Nursing'] },
        { name: 'Royal Institute of Technology (KTH)', rank: '#2 Sweden', courses: ['Engineering','Computer Science','Architecture','Mathematics'] },
    ],
    'UAE (Dubai)': [
        { name: 'Khalifa University', rank: '#1 UAE Public', courses: ['Engineering','Computer Science','Physics','Nuclear Engineering'] },
        { name: 'University of Dubai', rank: '#1 UAE Private', courses: ['MBA','Engineering','Computer Science','Finance','Law'] },
        { name: 'American University of Sharjah', rank: 'Top UAE', courses: ['Architecture','Engineering','Business','Arts & Sciences'] },
    ],
    'South Korea': [
        { name: 'Seoul National University', rank: '#1 Korea', courses: ['Engineering','Medicine','Business','Law','Education'] },
        { name: 'KAIST', rank: '#2 Korea', courses: ['Computer Science','AI','Engineering','Mathematics','Biotechnology'] },
        { name: 'Yonsei University', rank: '#3 Korea', courses: ['Business','Medicine','Law','International Relations','Social Sciences'] },
    ],
    'Italy': [
        { name: 'University of Bologna', rank: '#1 Italy', courses: ['Law','Medicine','Engineering','Arts','Economics'] },
        { name: 'Politecnico di Milano', rank: 'Top Design', courses: ['Architecture','Design','Engineering','Urban Planning'] },
    ],
    'Spain': [
        { name: 'University of Barcelona', rank: '#1 Spain', courses: ['Medicine','Law','Economics','Arts','Science'] },
        { name: 'IE University', rank: 'Top Business ES', courses: ['MBA','Finance','Data Analytics','Law','Design'] },
    ],
    'Malaysia': [
        { name: 'University of Malaya', rank: '#1 Malaysia', courses: ['Medicine','Engineering','Computer Science','Business','Law'] },
        { name: 'Universiti Teknologi Malaysia', rank: '#2 Malaysia', courses: ['Engineering','Architecture','IT','Built Environment'] },
    ],
    'Schengen / Europe': [
        { name: 'ETH Zurich (Switzerland)', rank: '#1 Europe', courses: ['Engineering','Computer Science','Physics','Mathematics','Architecture'] },
        { name: 'Technical University of Munich', rank: 'Top Germany', courses: ['Mechanical Engineering','Computer Science','MBA','Physics'] },
        { name: 'University of Amsterdam', rank: 'Top Netherlands', courses: ['Business','Economics','Psychology','Law','Social Sciences'] },
        { name: 'KU Leuven (Belgium)', rank: 'Top Belgium', courses: ['Engineering','Medicine','Sciences','Economics','Law'] },
        { name: 'University of Copenhagen (Denmark)', rank: 'Top Scandinavia', courses: ['Medicine','Law','Humanities','Science','Social Sciences'] },
    ],
};

function showUniversities() {
    var visaType = document.getElementById('visaType').value;
    var country  = document.getElementById('destination').value;
    var section  = document.getElementById('univSection');
    var grid     = document.getElementById('univGrid');
    var title    = document.getElementById('univCountryTitle');

    if (visaType !== 'Student Visa') { section.style.display = 'none'; return; }
    var data = UNIVERSITIES[country];
    if (!data) { section.style.display = 'none'; return; }

    title.textContent = country;
    grid.innerHTML = '';
    data.forEach(function(u, i) {
        var card = document.createElement('div');
        card.className = 'univ-card';
        card.style.animationDelay = (i * 0.08) + 's';
        var courseTags = u.courses.map(function(c) {
            return '<span class="univ-course-tag">' + c + '</span>';
        }).join('');
        card.innerHTML =
            '<div class="univ-card-top">' +
              '<div class="univ-icon"><i class="fa-solid fa-graduation-cap"></i></div>' +
              '<div class="univ-name">' + u.name + '</div>' +
            '</div>' +
            '<span class="univ-rank"><i class="fa-solid fa-trophy" style="font-size:0.7rem;margin-right:4px;"></i>' + u.rank + '</span>' +
            '<div class="univ-courses-label">Popular Courses</div>' +
            '<div class="univ-courses">' + courseTags + '</div>';
        grid.appendChild(card);
    });
    section.style.display = 'block';
    setTimeout(function() { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

document.getElementById('visaType').addEventListener('change', showUniversities);
document.getElementById('destination').addEventListener('change', showUniversities);
