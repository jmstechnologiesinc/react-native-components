import * as React from 'react';
import renderer from 'react-test-renderer';
import color from 'color';
import FAB from '../FAB';
import { getFABColors } from '../FAB/utils';
import getContrastingColor from '../../utils/getContrastingColor';
import { black, white } from '../../styles/themes/v2/colors';

import MD3LightTheme from '../../styles/themes/v3/LightTheme';
import MD2LightTheme from '../../styles/themes/v2/LightTheme';
import MD3DarkTheme from '../../styles/themes/v3/DarkTheme';
import MD2DarkTheme from '../../styles/themes/v2/DarkTheme';

const getTheme = (isDark = false, isV3 = true) => {
  const theme = isDark
    ? isV3
      ? MD3DarkTheme
      : MD2DarkTheme
    : isV3
    ? MD3LightTheme
    : MD2LightTheme;
  return {
    ...theme,
    isV3,
  };
};

it('renders normal FAB', () => {
  const tree = renderer.create(<FAB onPress={() => {}} icon="plus" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders small FAB', () => {
  const tree = renderer
    .create(<FAB size="small" onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extended FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" label="Add items" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" loading={true} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" disabled />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom color for the icon and label of the FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" color="#AA0114" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible FAB', () => {
  const { update, toJSON } = renderer.create(
    <FAB onPress={() => {}} icon="plus" />
  );
  update(<FAB onPress={() => {}} icon="plus" visible={false} />);

  expect(toJSON()).toMatchSnapshot();
});

it('renders visible FAB', () => {
  const { update, toJSON } = renderer.create(
    <FAB onPress={() => {}} icon="plus" visible={false} />
  );

  update(<FAB onPress={() => {}} icon="plus" visible={true} />);

  expect(toJSON()).toMatchSnapshot();
});

describe('getFABColors - background color', () => {
  it('should return color from styles', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
        style: { backgroundColor: 'purple' },
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2, light mode', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: color(black).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct disabled color, for theme version 2, dark mode', () => {
    expect(
      getFABColors({
        theme: getTheme(true, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: color(white).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct theme color, for theme version 3, primary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, secondary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'secondary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, tertiary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'tertiary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.tertiaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, surface variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'surface',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.elevation.level3,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: getTheme(false, false).colors.accent,
    });
  });
});

describe('getFABColors - foreground color', () => {
  it('should return custom color', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
        customColor: 'purple',
      })
    ).toMatchObject({
      foregroundColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
        disabled: true,
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2, light mode', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: color(black).alpha(0.32).rgb().string(),
    });
  });

  it('should return correct disabled color, for theme version 2, dark mode', () => {
    expect(
      getFABColors({
        theme: getTheme(true, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: color(white).alpha(0.32).rgb().string(),
    });
  });

  it('should return correct theme color, for theme version 3, primary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onPrimaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, secondary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'secondary',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, tertiary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'tertiary',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onTertiaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, surface variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'surface',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.primary,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: getContrastingColor(
        getTheme(false, false).colors.accent,
        white,
        'rgba(0, 0, 0, .54)'
      ),
    });
  });
});
