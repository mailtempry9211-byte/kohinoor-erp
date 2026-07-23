# Kohinoor ERP — Desktop Edition (v0.0.1 — Foundation)

Ye Electron + React + TypeScript + SQLite ka foundation project hai.
Abhi ismein 2 modules working hain: **Dashboard** aur **Inventory** (full CRUD, SQLite mein save hota hai).

---

## Step 1 — Node.js check karo
CMD/Terminal kholo aur ye chalao:
```
node -v
```
Agar version na aaye, pehle Node.js (LTS version) install karo: https://nodejs.org

## Step 2 — pnpm check karo
```
pnpm -v
```
Agar nahi hai:
```
npm install -g pnpm
```

## Step 3 — Is folder ko apne PC par le jao
Is poore `kohinoor-erp` folder ko kahin bhi (jaise `D:\Projects\KohinoorERP`) rakho.

## Step 4 — Dependencies install karo
Us folder ke andar CMD kholo aur:
```
pnpm install
```
(Isme thoda time lagega, `better-sqlite3` compile hota hai — agar error aaye to neeche "Common Errors" dekho.)

## Step 5 — App chalao
```
pnpm dev
```
Electron ki window khulni chahiye jisme **Dashboard** aur **Inventory** sidebar mein dikhega.

## Step 6 — Test karo
Inventory page par jao, ek item add karo (Name, SKU, Quantity), Add Item dabao.
Agar list mein item dikh jaye — matlab React ↔ Electron ↔ SQLite teeno properly connect hain. 🎉

---

## GitHub par kaise upload karo
```
git init
git add .
git commit -m "Foundation: Electron + React + SQLite + Inventory module"
git branch -M main
git remote add origin https://github.com/<aapka-username>/kohinoor-erp.git
git push -u origin main
```
(`.gitignore` already `node_modules` aur `out` folder ko ignore karta hai, isliye upload halka aur fast hoga.)

## Windows EXE banane ke liye (baad mein, jab feature-complete ho)
```
pnpm build:win
```
`dist` folder mein installer ban jayega.

---

## Common Errors

**"ERR_PNPM_EXOTIC_SUBDEP" error**
pnpm ka naya security feature `@electron/node-gyp` (jo `@electron/rebuild` ke andar hai) ko block kar raha tha kyunki wo GitHub se aata hai. Fix `pnpm-workspace.yaml` file mein daal diya gaya hai. Bas clean reinstall karo:
```
rmdir /s /q node_modules
del pnpm-lock.yaml
pnpm install
```

**"cannot find prebuild-install" / "%1 is not a valid Win32 application"**
Ye 2 cheezein hui thi: (1) pnpm ke naye version ne security ki wajah se dependency scripts block kar diye, (2) `electron-builder install-app-deps` Windows par pnpm ke saath buggy hai.
Fix already `package.json` mein kar diya gaya hai (`@electron/rebuild` use ho raha hai ab). Bas ek baar clean reinstall karo:
```
rmdir /s /q node_modules
del pnpm-lock.yaml
pnpm install
```
Agar beech mein pnpm ek prompt de "The following dependencies have build scripts..." to `y` daal kar sabko approve kar dena (ya alag se `pnpm approve-builds` chala lena).

**better-sqlite3 build error / node-gyp error**
Windows par ye tools chahiye hote hain:
```
npm install -g windows-build-tools
```
ya "Visual Studio Build Tools" (Desktop development with C++ workload) install karo.

**pnpm dev par blank white screen**
Terminal ka error dekho aur screenshot bhej do — turant fix ho jayega.

---

## Project Structure
```
kohinoor-erp/
  src/
    main/           -> Electron main process (window, SQLite, IPC handlers)
    preload/        -> Secure bridge between main aur renderer
    renderer/       -> React UI (Dashboard, Inventory, aur aage ke sab pages)
    shared/         -> Dono taraf use hone wale types aur IPC channel names
```

## Agla Module (Approval / Reports / Production)
Jaise hi ye foundation chal jaye, agla module isi pattern par banega:
1. `src/main/modules/<naam>.ts` — database queries
2. `src/shared/ipc-channels.ts` — naye channels add
3. `src/main/index.ts` — naye handlers register
4. `src/preload/index.ts` — naye methods expose
5. `src/renderer/src/pages/<Naam>.tsx` — naya UI page
