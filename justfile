dev:
    npm run dev -- --db /home/ryan/.config/joplin-desktop/database.sqlite

install:
    npm install
    npm rebuild better-sqlite3 --update-binary

test:
    # npx jest src/main/database.test.ts
    npx jest --config=jest.config.js src/main/database.test.ts
    # npm install --save-dev jest ts-jest @types/jest
