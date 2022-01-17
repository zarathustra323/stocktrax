<template>
  <svg
    :class="classes"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <!-- eslint-disable-next-line -->
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'light',
      validator: (color) => ['sky-500', 'white'].includes(color),
    },
    size: {
      type: String,
      default: '5',
      validator: (size) => ['3', '5', '8'].includes(size),
    },
  },

  computed: {
    classes() {
      const { color, size } = this;
      const classes = ['animate-spin'];
      if (color === 'sky-500') classes.push('text-sky-500');
      if (color === 'white') classes.push('text-white');
      if (size === '3') classes.push('w-3', 'h-3');
      if (size === '5') classes.push('w-5', 'h-5');
      if (size === '8') classes.push('w-8', 'h-8');
      return classes;
    },
  },
};
</script>
