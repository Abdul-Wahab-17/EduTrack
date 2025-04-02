function Contact() {
    return (
      <div className="container mx-auto p-4">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Qalam ID</th>
              <th className="px-4 py-2 border border-gray-300">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Abdul Wahab</td>
              <td className="px-4 py-2 border border-gray-300">464018</td>
              <td className="px-4 py-2 border border-gray-300">awahab.bscs23seecs@seecs.edu.pk</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  export default Contact;
  