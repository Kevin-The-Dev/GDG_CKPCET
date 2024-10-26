document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/leaderboard');
        const data = await response.json();
        const tableBody = document.getElementById('leaderboard-data');

        // Sort data first by "Completion of Chapter And Arcade" ("Yes" first), then by "No. of Chapter Completed"
        data.sort((a, b) => {
            if (a["All Skill Badges & Games Completed"] === "Yes" && b["All Skill Badges & Games Completed"] !== "Yes") {
                return -1;
            } else if (a["All Skill Badges & Games Completed"] !== "Yes" && b["All Skill Badges & Games Completed"] === "Yes") {
                return 1;
            } 
            const noOfChaptersA = (a["Names of Completed Skill Badges"].match(/\[Skill Badge\]/g) || []).length;
            const noOfChaptersB = (b["Names of Completed Skill Badges"].match(/\[Skill Badge\]/g) || []).length;
            return noOfChaptersB - noOfChaptersA;
        });

        // Calculate eligible participants for swags and certificates
        let eligibleParticipantsCount = 0;
        data.forEach((user) => {
            if (user["All Skill Badges & Games Completed"] === "Yes") {
                eligibleParticipantsCount++;
            }
        });

        // Update the info boxes dynamically
        document.getElementById('eligible-swags').textContent = eligibleParticipantsCount;
        document.getElementById('eligible-certificates').textContent = eligibleParticipantsCount;
        document.getElementById('total-participants').textContent = 139;

        // Populate the leaderboard table
        data.forEach((user, index) => {
            const row = document.createElement('tr');
            
            const chapterNames = user["Names of Completed Skill Badges"] || "No Chapters Completed";
            const arcadeNames = user["Names of Completed Arcade Games"] || "No Arcade Games Completed";

            const formattedChapters = chapterNames === "No Chapters Completed" 
                ? chapterNames 
                : chapterNames.split(' | ').map((chapter, idx) => `${idx + 1}. ${chapter.trim()}`).join('\n');
                
            const formattedArcadeGames = arcadeNames === "No Arcade Games Completed" 
                ? arcadeNames 
                : arcadeNames.split(' | ').map((game, idx) => `${idx + 1}. ${game.trim()}`).join('\n');

            const noOfChapters = (chapterNames.match(/\[Skill Badge\]/g) || []).length;
            const noOfArcadeGames = arcadeNames === "No Arcade Games Completed" ? 0 : arcadeNames.split(' | ').length;
            const arcadeCompletionStatus = noOfArcadeGames > 0 ? "Completed" : "Not Completed";

            // Badge SVG for "Yes" Completion
            const badgeIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check-fill ms-1" viewBox="0 0 16 16">
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                </svg>
            `;

            // Add badge icon if "Completion of Chapter And Arcade" is "Yes"
            const userName = user["User Name"];
            const displayName = user["All Skill Badges & Games Completed"] === "Yes" 
                ? `${userName} ${badgeIcon}` 
                : userName;

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${displayName}</td>
                <td>${user["Access Code Redemption Status"] || "Not Available"}</td>
                <td><a href="${user["Google Cloud Skills Boost Profile URL"]}" target="_blank" class="btn btn-link">Profile</a></td>
                <td>${user["All Skill Badges & Games Completed"]}</td>
                <td title="${formattedChapters}">${noOfChapters}</td>
                <td title="${formattedArcadeGames}">${noOfArcadeGames}</td>
                <td>${arcadeCompletionStatus}</td>
            `;
            tableBody.appendChild(row);
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('keyup', function() {
            const searchValue = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                row.style.display = name.includes(searchValue) ? '' : 'none';
            });
        });
    } catch (error) {
        console.error("Error loading data:", error);
    }
});
