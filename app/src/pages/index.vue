<template>
  <nav class="lg:text-sm lg:leading-6">
    <ul class="space-y-6 lg:space-y-2 border-l border-slate-800">
      <li v-for="item in navItems" :key="item.to">
        <router-link
          :class="linkClasses"
          :to="item.to"
        >
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>

export default {
  name: 'IndexPage',

  data: () => ({
    linkClasses: 'block border-l pl-4 -ml-px border-transparent hover:border-slate-500 text-slate-400 hover:text-slate-300',
    navItems: [
      { name: 'Transactions', to: '/transactions' },
    ],
  }),
};
</script>
