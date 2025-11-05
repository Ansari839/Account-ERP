import Grn from '@/models/Grn';

export const generateGrnCode = async () => {
  const lastGrn = await Grn.findOne().sort({ createdAt: -1 });
  if (lastGrn && lastGrn.grnCode) {
    const lastCode = parseInt(lastGrn.grnCode.replace('GRN', ''), 10);
    return `GRN${lastCode + 1}`;
  }
  return 'GRN1';
};
