import type { Config } from '@jest/types'

const packages: [name: string, folder?: string][] = [
    ['react-immutable-editor'],
]

const toPackageFolder = (pkg: [name: string, folder?: string]) => {
    return pkg[1] || pkg[0]
}

const base: Config.InitialProjectOptions = {
    preset: 'ts-jest/presets/default-esm',
    transformIgnorePatterns: [
        `node_modules/?!(${[...packages].map(toPackageFolder).join('|')})`,
    ],
    transform: {
        '^.+\\.ts$': ['ts-jest', {useESM: true}],
        '^.+\\.tsx$': ['ts-jest', {useESM: true}],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        // '^(\\.{1,2}/.*)\\.ts$': '$1',
        // '^(\\.{1,2}/.*)\\.tsx$': '$1',
        ...packages.reduce((nameMapper, pkg) => {
            nameMapper[`^${pkg[0]}\\/(.*)$`] = `<rootDir>/packages/${toPackageFolder(pkg)}/$1`
            nameMapper[`^${pkg[0]}$`] = `<rootDir>/packages/${toPackageFolder(pkg)}`
            return nameMapper
        }, {}),
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '<rootDir>/apps/demo',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/dist',
    ],
    watchPathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/apps/demo/dist',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/apps/demo/dist',
    ],
}

const config: Config.InitialOptions = {
    ...base,
    collectCoverage: true,
    verbose: true,
    coverageDirectory: '<rootDir>/coverage',
    projects: [
        {
            displayName: 'test-apps-demo',
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/apps/demo/node_modules'],
            testMatch: [
                '<rootDir>/apps/demo/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/apps/demo/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        },
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg[0],
            ...base,
            moduleDirectories: [
                'node_modules', '<rootDir>/packages/' + toPackageFolder(pkg) + '/node_modules',
            ],
            testMatch: [
                '<rootDir>/packages/' + toPackageFolder(pkg) + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + toPackageFolder(pkg) + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
}

export default config
