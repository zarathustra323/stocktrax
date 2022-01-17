<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    @click="$emit('click', $event)"
  >
    <loading-spinner v-if="loading" :color="loadingColor" class="-ml-1 mr-3" />
    <component v-if="icon" :is="icon" :class="iconClasses" />
    <slot />
  </button>
</template>

<script>
import LoadingSpinner from './loading-spinner.vue';

export default {
  name: 'ButtonElement',
  emits: ['click'],
  components: { LoadingSpinner },

  props: {
    type: {
      type: String,
      default: 'button',
      validator: (type) => ['button', 'submit', 'reset'].includes(type),
    },
    color: {
      type: String,
      default: 'slate-800',
      validator: (color) => ['slate-800'].includes(color),
    },
    rounded: {
      type: String,
      default: 'medium',
      validator: (rounded) => ['none', 'medium'].includes(rounded),
    },
    block: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Function,
      default: null,
    },
  },

  computed: {
    bgColor() {
      if (this.color === 'slate-800') return 'bg-slate-800 hover:bg-sky-400/20 disabled:bg-slate-800';
      return null;
    },
    ringColor() {
      if (this.color === 'slate-800') return 'ring-slate-200/20 focus:ring-2 focus:ring-slate-400';
      return null;
    },
    textColor() {
      if (this.color === 'slate-800') return 'text-sky-500';
      return null;
    },
    loadingColor() {
      if (this.color === 'slate-800') return 'sky-500';
      return null;
    },

    iconClasses() {
      return [
        this.textColor,
        '-ml-1',
        'mr-3 ',
        'h-5',
        'w-5',
      ];
    },
    classes() {
      const classes = [
        this.bgColor,
        this.textColor,
        this.ringColor,
        'inline-flex',
        'items-center',
        'px-4',
        'py-2',
        'font-semibold',
        'leading-6',
        'text-sm',
        'shadow',
        'transition',
        'ease-in-out',
        'duration-150',
        'ring-1',
        'disabled:opacity-60',
        'focus:outline-none',
      ];

      if (this.rounded === 'medium') classes.push('rounded-md');
      if (this.block) classes.push('w-full');
      if (this.disabled) classes.push('cursor-not-allowed');
      if (this.loading) classes.push('cursor-wait');

      return classes;
    },
  },
};
</script>
