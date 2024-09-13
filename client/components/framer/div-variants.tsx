'use client';

import { type Variants } from 'framer-motion';

export const delayFadeInVariant: Variants = {
  hidden: { opacity: 0 },
  enter: (custom: number) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: 0.05 * custom }
  }),
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

export const ComingFromTopVariant: Variants = {
  hidden: {
    opacity: 0,
    y: -100
  },
  enter: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: 100
  }
};

export const ComingFromBottomVariant: Variants = {
  hidden: {
    opacity: 0,
    y: '100%'
  },
  enter: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: '-100%'
  }
};

export const ComingFromLeftVariant: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.5
    }
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.5
    }
  }
};

export const ComingFromLeftVariantWithFadeExit: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.5
    }
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,

    transition: {
      duration: 0.3
    }
  }
};

export const ComingFromRightVariantWithFadeExit: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.5
    }
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,

    transition: {
      duration: 0.3
    }
  }
};

export const FullTranslateFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100
  },
  enter: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 100
  }
};

export const TextSliderVariant: Variants = {
  hidden: {
    opacity: 0,
    x: -100
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring'
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.2
    }
  }
};

export const ComingFromRightVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.5
    }
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.5
    }
  }
};

export const FromTopStaggerVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 4
  },
  enter: () => ({
    opacity: 1,
    y: 0
  }),
  exit: {
    opacity: 0,
    y: -100
  }
};

export const FadeInVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 0
  },
  enter: () => ({
    opacity: 1,
    y: 0
  }),
  exit: {
    opacity: 0,
    y: 0
  }
};
