using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class ChangeAlbomTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Alboms_AlbomId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "AlbomId",
                table: "Images",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Alboms_AlbomId",
                table: "Images",
                column: "AlbomId",
                principalTable: "Alboms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Alboms_AlbomId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "AlbomId",
                table: "Images",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Alboms_AlbomId",
                table: "Images",
                column: "AlbomId",
                principalTable: "Alboms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
