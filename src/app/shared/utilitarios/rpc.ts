export interface RPC {
    id?: number;
    documentosCriadosId: number;
    numeroProcesso: string;
    auth: string;
    dataEntrada: string;
    sigla: string;
    compiladoHoraAula: boolean;
    compiladoHoraAulaNr: number;
    bbm: string;
    observacoes: string;
}
