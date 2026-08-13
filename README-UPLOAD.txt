ACTS v5.1.3 위원회 인물소개 시스템 패치

GitHub 저장소 루트에 아래 파일만 업로드/덮어쓰기하세요. assets 폴더는 건드리지 않습니다.

덮어쓰기: committees.html, styles.css, mega-menu.js
새 파일: committee.html, committee-data.js

인물 등록은 committee-data.js의 해당 위원회 members 배열에 다음 형식으로 추가합니다.
{ name: "이름", role: "위원장", photo: "assets/committee/파일명.jpg", bio: "간단한 소개" }

사진 파일은 필요할 때 assets/committee 폴더에 개별 업로드하면 됩니다.
