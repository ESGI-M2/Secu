# front
npm install --force
npm run dev

# back
docker compose up
npm install --force
npm run start:dev 

# bdd
npx prisma studio -> http://localhost:5555/

# mailing
http://localhost:1080/

Attention le back et le front utilise le meme port par default(3000), le 2e passera sur 3001