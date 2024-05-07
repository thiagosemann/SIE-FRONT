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
    compiladoHoraAulaNr: number;
    compiladoDiariaCurso: boolean;
    compiladoDiariaCursoNr: number;
    observacoes: string;
}
