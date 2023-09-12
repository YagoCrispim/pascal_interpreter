export const testCode = `
PROGRAM Part12;
VAR
   a : INTEGER;

PROCEDURE P1;
VAR
   a : REAL;
   k : INTEGER;

   PROCEDURE P2;
   VAR
      a, z : INTEGER;
   BEGIN {P2}
      z := 777;
   END;  {P2}

BEGIN {P1}

END;  {P1}

BEGIN {Part12}
   a := 10;
END.  {Part12}
`;

export const codeAst = {
  name: 'Part12',
  block: {
    declarations: [
      {
        varNode: {
          token: {
            type: 'ID',
            value: 'a',
          },
          value: 'a',
        },
        typeNode: {
          token: {
            type: 'INTEGER',
            value: 'INTEGER',
          },
          value: 'INTEGER',
        },
      },
      {
        name: 'P1',
        block: {
          declarations: [
            {
              varNode: {
                token: {
                  type: 'ID',
                  value: 'a',
                },
                value: 'a',
              },
              typeNode: {
                token: {
                  type: 'REAL',
                  value: 'REAL',
                },
                value: 'REAL',
              },
            },
            {
              varNode: {
                token: {
                  type: 'ID',
                  value: 'k',
                },
                value: 'k',
              },
              typeNode: {
                token: {
                  type: 'INTEGER',
                  value: 'INTEGER',
                },
                value: 'INTEGER',
              },
            },
            {
              name: 'P2',
              block: {
                declarations: [
                  {
                    varNode: {
                      token: {
                        type: 'ID',
                        value: 'a',
                      },
                      value: 'a',
                    },
                    typeNode: {
                      token: {
                        type: 'INTEGER',
                        value: 'INTEGER',
                      },
                      value: 'INTEGER',
                    },
                  },
                  {
                    varNode: {
                      token: {
                        type: 'ID',
                        value: 'z',
                      },
                      value: 'z',
                    },
                    typeNode: {
                      token: {
                        type: 'INTEGER',
                        value: 'INTEGER',
                      },
                      value: 'INTEGER',
                    },
                  },
                ],
                compoundStatements: {
                  children: [
                    {
                      left: {
                        token: {
                          type: 'ID',
                          value: 'z',
                        },
                        value: 'z',
                      },
                      operaion: {
                        type: 'ASSIGN',
                        value: ':=',
                      },
                      right: {
                        token: {
                          type: 'INTEGER_CONST',
                          value: '777',
                        },
                        value: 777,
                      },
                    },
                    {
                    },
                  ],
                },
              },
            },
          ],
          compoundStatements: {
            children: [
              {
              },
            ],
          },
        },
      },
    ],
    compoundStatements: {
      children: [
        {
          left: {
            token: {
              type: 'ID',
              value: 'a',
            },
            value: 'a',
          },
          operaion: {
            type: 'ASSIGN',
            value: ':=',
          },
          right: {
            token: {
              type: 'INTEGER_CONST',
              value: '10',
            },
            value: 10,
          },
        },
        {
        },
      ],
    },
  },
};
