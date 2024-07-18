
const format = () => {
  const formatDateTime = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", };
    const newDate = new Date(date);
    return newDate.toLocaleDateString("vi-VN", options).replace(/\//g, "-");
  };
  return {
    formatDateTime
  };
};

export default format;
