# registry-template

@shadcn

### How to use

1. run this project locally

```sh
pnpm install
pnpm run dev
```

2. create a new project in a separate tab

```sh
pnpm dlx shadcn init
```

3. add registry toolkit `app/registry/[name]/route.ts`

```sh
pnpm dlx shadcn add http://localhost:3000/registry/registry-access

# or directly to the r folder
pnpm dlx shadcn add http://localhost:3000/r/registry-access.json

# or in this vercel.app domain
pnpm dlx shadcn add https://registry-template-zeta.vercel.app/registry/registry-access
pnpm dlx shadcn add https://registry-template-zeta.vercel.app/r/registry-access.json
```