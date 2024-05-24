export interface RFC {
    id?: number;
    documentosCriadosId: number;
    numeroProcesso: string;
    auth: string;
    dataEntrada: string;
    matriculados: number;
    excluidos: number;
    desistentes: number;
    reprovados: number;
    aprovados: number;
    statusCertificado: string;
    statusDrive: string;
    statusNb: string;
    statusFinalizacao: string;
    sigla: string;
    compiladoHoraAula: boolean;
    compilado_id?: number;
    compiladoDiariaCurso: boolean;
    compiladoDiariaCursoNr: number;
    fimCur: string;
    iniCur: string;
    haCurso: string;
    haiCurso: string;
    bbm: string;
    observacoes: string;
}
